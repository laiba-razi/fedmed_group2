import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DnaCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 4. Group for DNA Helix
    // Group for DNA Helix Container (Outer: Tilt & Position)
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Sub-group for DNA Mesh (Inner: Pure Axial Spin around central core)
    const helixMeshGroup = new THREE.Group();
    dnaGroup.add(helixMeshGroup);

    // Build DNA Geometry
    const numPairs = 48;
    const helixRadius = 2.2;
    const helixHeight = 32;
    const pitch = 0.35;

    // Silver/Platinum Backbone Material
    const strandMaterial = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x475569,
      emissiveIntensity: 0.25,
    });

    // Cyan Base Pair Material
    const cyanMaterial = new THREE.MeshStandardMaterial({
      color: 0x06B6D4,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x06B6D4,
      emissiveIntensity: 0.7,
    });

    // Violet Base Pair Material
    const violetMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x8B5CF6,
      emissiveIntensity: 0.7,
    });

    const sphereGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.09, 0.09, 1, 12);

    for (let i = 0; i < numPairs; i++) {
      const t = (i / numPairs) * helixHeight - helixHeight / 2;
      const angle = i * pitch;

      // Position for Strand 1 & Strand 2
      const x1 = Math.cos(angle) * helixRadius;
      const z1 = Math.sin(angle) * helixRadius;
      const x2 = Math.cos(angle + Math.PI) * helixRadius;
      const z2 = Math.sin(angle + Math.PI) * helixRadius;

      // Strand 1 Node
      const node1 = new THREE.Mesh(sphereGeo, strandMaterial);
      node1.position.set(x1, t, z1);
      helixMeshGroup.add(node1);

      // Strand 2 Node
      const node2 = new THREE.Mesh(sphereGeo, strandMaterial);
      node2.position.set(x2, t, z2);
      helixMeshGroup.add(node2);

      // Connecting Base Pair Rod
      const rMat = i % 2 === 0 ? cyanMaterial : violetMaterial;
      const rod = new THREE.Mesh(cylinderGeo, rMat);
      
      rod.position.set((x1 + x2) / 2, t, (z1 + z2) / 2);
      rod.scale.set(1, helixRadius * 2, 1);

      // Orient rod between the two nodes
      const direction = new THREE.Vector3(x2 - x1, 0, z2 - z1).normalize();
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

      helixMeshGroup.add(rod);
    }

    // 5. Particle Dust Field
    const particleCount = 250;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 35;
      particlePos[i + 1] = (Math.random() - 0.5) * 35;
      particlePos[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xCBD5E1,
      size: 0.09,
      transparent: true,
      opacity: 0.65,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06B6D4, 2.5);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8B5CF6, 2.5);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1.8, 35);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // 7. Scroll-driven animation state
    // Initial slope: -0.92 radians (-53 deg) lies along diagonal from bottom-left to top-right at top of page
    let targetRotationZ = -0.92;
    let scrollYOffset = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      
      // Calculate scroll progress through hero section (0 to 1)
      const heroProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

      // Transition Z tilt from diagonal (-0.92 rad) at top to vertical (0.0 rad) when scrolled down
      targetRotationZ = THREE.MathUtils.lerp(-0.92, 0.0, heroProgress);
      scrollYOffset = scrollY * 0.0025;
    };

    window.addEventListener('scroll', handleScroll);

    // 8. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Pure Local Axial Spin: inner mesh spins strictly around its central core longitudinal axis (local Y-axis)
      helixMeshGroup.rotation.y = elapsedTime * 0.6 + scrollYOffset;

      // Outer container lerps parent Z-tilt from diagonal slope (top) to vertical (middle/bottom)
      dnaGroup.rotation.z = THREE.MathUtils.lerp(dnaGroup.rotation.z, targetRotationZ, 0.08);

      // Keep DNA Helix centered in the middle of the screen aligned with the central glowing axis line
      dnaGroup.position.set(0, 0, 0);

      // Rotate particle background slightly
      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
