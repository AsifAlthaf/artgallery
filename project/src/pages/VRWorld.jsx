import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky, Text, Image, useCursor } from '@react-three/drei';
import axios from 'axios';
import * as THREE from 'three';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Utility to optimize high-res images to smaller textures to prevent GPU crash
const optimizeTextureUrl = (url, width = 1000) => {
    if (!url) return url;
    if (url.includes('cloudinary.com') && !url.includes('/upload/q_auto')) {
        return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`);
    }
    return url;
};

// Procedural Artwork Frame Component
const Painting = ({ artwork, position, rotation }) => {
    // Generate a secure cross-origin texture load
    const textureUrl = optimizeTextureUrl(artwork.imageUrl) || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    // Provide default safe dimensions for Drei Image
    const height = 4;
    const width = 4; // Drei Image automatically calculates covers/aspects

    return (
        <group position={position} rotation={rotation}>
            {/* The Frame border */}
            <mesh position={[0, height / 2, -0.05]}>
                <boxGeometry args={[width + 0.4, height + 0.4, 0.1]} />
                <meshStandardMaterial color={hovered ? "#ff6b00" : "#222"} roughness={0.8} />
            </mesh>
            
            {/* The Canvas showing the Artwork via secure R3F Image hook */}
            <Image 
                url={textureUrl}
                position={[0, height / 2, 0.01]} 
                scale={[width, height]}
                zoom={1}
                transparent
                onPointerOver={() => setHovered(true)} 
                onPointerOut={() => setHovered(false)}
                onClick={() => {
                   window.open(`/artwork/${artwork._id}`, '_blank');
                }}
            />

            {/* Placard Data */}
            <group position={[0, -0.6, 0.05]}>
                <mesh position={[0, 0, -0.02]}>
                   <boxGeometry args={[width * 0.8, 0.8, 0.02]} />
                   <meshStandardMaterial color="#fff" />
                </mesh>
                <Text position={[0, 0.15, 0]} fontSize={0.2} color="black" anchorX="center" maxWidth={width * 0.7} outlineWidth={0.01} outlineColor="white">
                    {artwork.title}
                </Text>
                <Text position={[0, -0.15, 0]} fontSize={0.12} color="#666" anchorX="center">
                    by {artwork.artist?.name || artwork.artist?.username || 'Unknown'} - ${artwork.price}
                </Text>
            </group>
        </group>
    );
};

// WASD Player Controller
const Player = () => {
    const { camera } = useThree();
    const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch(e.code) {
                case 'KeyW': case 'ArrowUp': setMovement(m => ({...m, forward: true})); break;
                case 'KeyS': case 'ArrowDown': setMovement(m => ({...m, backward: true})); break;
                case 'KeyA': case 'ArrowLeft': setMovement(m => ({...m, left: true})); break;
                case 'KeyD': case 'ArrowRight': setMovement(m => ({...m, right: true})); break;
            }
        };
        const handleKeyUp = (e) => {
            switch(e.code) {
                case 'KeyW': case 'ArrowUp': setMovement(m => ({...m, forward: false})); break;
                case 'KeyS': case 'ArrowDown': setMovement(m => ({...m, backward: false})); break;
                case 'KeyA': case 'ArrowLeft': setMovement(m => ({...m, left: false})); break;
                case 'KeyD': case 'ArrowRight': setMovement(m => ({...m, right: false})); break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        const speed = 15 * delta;
        const dir = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, (movement.backward ? 1 : 0) - (movement.forward ? 1 : 0));
        const sideVector = new THREE.Vector3((movement.left ? 1 : 0) - (movement.right ? 1 : 0), 0, 0);
        
        dir.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);
        
        // Calculate camera direction
        const camEuler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
        dir.applyEuler(camEuler); 
        
        // Apply movement vector to camera restricting Y axis (no flying)
        camera.position.add(new THREE.Vector3(dir.x, 0, dir.z));
    });

    return null;
};

// Physics/Ground
const Ground = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#333333" roughness={0.8} />
        </mesh>
    );
};

const VRWorld = () => {
   const [artworks, setArtworks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const navigate = useNavigate();

   // Bootstrapping the Gallery data
   useEffect(() => {
       const fetchGallery = async () => {
           try {
               const { data } = await axios.get('/api/artworks');
               const arts = data.artworks || data || [];
               setArtworks(arts.slice(0, 20)); // Limit to first 20 to save GPU
           } catch(e) {
               console.error("VR WebGL Data error:", e);
               setError(true);
           } finally {
               setLoading(false);
           }
       };
       fetchGallery();
   }, []);

   if (loading) {
       return (
           <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
               <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
               <h2 className="text-2xl font-playfair tracking-widest uppercase">Initializing Canvas...</h2>
               <p className="text-gray-500 font-mono mt-2">Loading textures and geometries into GPU</p>
           </div>
       );
   }

   if (error || artworks.length === 0) {
       return (
           <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8 text-center">
               <h2 className="text-3xl font-playfair tracking-widest text-orange-500 mb-4">Exhibition Offline</h2>
               <p className="text-gray-400 max-w-md mx-auto mb-8">We could not load the gallery artworks into the 3D space. Make sure the database is active.</p>
               <Button onClick={() => navigate('/')} variant="outline" className="text-white border-white hover:bg-white hover:text-black">Return Home</Button>
           </div>
       );
   }

   return (
       <div className="w-full h-screen bg-black relative select-none">
           {/* UI Overlay */}
           <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none flex justify-between items-start">
               <div>
                  <h1 className="text-4xl text-white font-playfair font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Oasis Exhibition</h1>
                  <p className="text-orange-400 font-mono text-sm mt-1 drop-shadow-md">WebVR Live Gallery Engine</p>
               </div>
               <Button 
                   onClick={() => navigate('/')} 
                   className="bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-orange-500 pointer-events-auto rounded-full"
               >
                   <ArrowLeft className="w-4 h-4 mr-2" /> Exit VR
               </Button>
           </div>

           <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 z-10 pointer-events-none text-center">
               <p className="text-white text-sm font-medium">Use <kbd className="bg-white/20 px-2 rounded mx-1">W A S D</kbd> to walk and mouse to look around.</p>
               <p className="text-gray-400 text-xs mt-1">Click canvas anywhere to lock cursor and activate VR.</p>
           </div>
           
           {/* WebGL Context */}
           <div id="vr-canvas-container" className="w-full h-full absolute inset-0">
             <Canvas shadows camera={{ position: [0, 1.5, 0], fov: 75 }}>
                 <Suspense fallback={null}>
                     <PointerLockControls selector="#vr-canvas-container" />
                     <Player />
                     
                     <Sky sunPosition={[10, 5, -10]} turbidity={0.1} rayleigh={0.1} />
                   
                   <ambientLight intensity={1.5} />
                   <pointLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" distance={50} />
                   <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />

                   <Ground />

                   {/* Procedural Generation of Gallery Walls */}
                   <group>
                       {artworks.map((art, index) => {
                           // Arrange them in a circle around the room
                           const radius = 15;
                           const angle = (index / artworks.length) * Math.PI * 2;
                           const x = Math.cos(angle) * radius;
                           const z = Math.sin(angle) * radius;
                           // Rotate to face the center
                           const rotation = [0, -angle - Math.PI / 2, 0];

                           return (
                               <Painting key={art._id} artwork={art} position={[x, 0, z]} rotation={rotation} />
                           );
                       })}
                   </group>
                   
               </Suspense>
             </Canvas>
           </div>
       </div>
   );
};

export default VRWorld;
