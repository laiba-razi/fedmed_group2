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
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Build DNA Geometry
    const numPairs = 36;
    const helixRadius = 2.4;
    const helixHeight = 22;
    const pitch = 0.4;

    // Silver/Platinum Backbone Material
    const strandMaterial = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x475569,
      emissiveIntensity: 0.2,
    });

    // Cyan Base Pair Material
    const cyanMaterial = new THREE.MeshStandardMaterial({
      color: 0x06B6D4,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x06B6D4,
      emissiveIntensity: 0.6,
    });

    // Violet Base Pair Material
    const violetMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x8B5CF6,
      emissiveIntensity: 0.6,
    });

    const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.08, 0.08, 1, 12);

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
      dnaGroup.add(node1);

      // Strand 2 Node
      const node2 = new THREE.Mesh(sphereGeo, strandMaterial);
      node2.position.set(x2, t, z2);
      dnaGroup.add(node2);

      // Connecting Base Pair Rod
      const rMat = i % 2 === 0 ? cyanMaterial : violetMaterial;
      const rod = new THREE.Mesh(cylinderGeo, rMat);
      
      rod.position.set((x1 + x2) / 2, t, (z1 + z2) / 2);
      rod.scale.set(1, helixRadius * 2, 1);

      // Orient rod between the two nodes
      const direction = new THREE.Vector3(x2 - x1, 0, z2 - z1).normalize();
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

      dnaGroup.add(rod);
    }

    // 5. Particle Dust Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 30;
      particlePos[i + 1] = (Math.random() - 0.5) * 30;
      particlePos[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xCBD5E1,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06B6D4, 2);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8B5CF6, 2);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xFFFFFF, 1.5, 30);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // 7. Scroll-driven animation state
    let targetRotationZ = -0.55; // Slope at top (bottom-left to top-right)
    let targetX = 4.5;            // Shifted right at top
    let targetY = 0;
    let targetRotationY = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);

      // Interpolate slope position from bottom-left->top-right (top) to center (mid) to vertical (bottom)
      if (scrollProgress < 0.5) {
        // Upper section: Move from right slope towards center
        const p = scrollProgress / 0.5;
        targetX = THREE.MathUtils.lerp(4.5, 0, p);
        targetRotationZ = THREE.MathUtils.lerp(-0.55, -0.2, p);
      } else {
        // Lower section: Center to vertical alignment
        const p = (scrollProgress - 0.5) / 0.5;
        targetX = THREE.MathUtils.lerp(0, -3.5, p);
        targetRotationZ = THREE.MathUtils.lerp(-0.2, 0.35, p);
      }

      targetRotationY = scrollProgress * Math.PI * 4;
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

      // Continuous rotation
      dnaGroup.rotation.y = elapsedTime * 0.4 + targetRotationY;

      // Smooth lerp positioning on scroll
      dnaGroup.position.x = THREE.MathUtils.lerp(dnaGroup.position.x, targetX, 0.05);
      dnaGroup.rotation.z = THREE.MathUtils.lerp(dnaGroup.rotation.z, targetRotationZ, 0.05);

      // Gentle floating motion
      dnaGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.3;

      // Rotate particle background slightly
      particles.rotation.y = elapsedTime * 0.05;

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
