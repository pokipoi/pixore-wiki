import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════
   NodeGraph3D
   - Floating workflow nodes in 3D space
   - Animated connection lines with flowing particles
   - Mouse drag interaction (rotate camera)
   - Scroll-driven camera dolly + node spread
   ═══════════════════════════════════════════════════════════ */

type Props = {
    className?: string;
    /** 0..1 normalized scroll progress for the hero stage */
    scrollProgressRef?: React.MutableRefObject<number>;
};

export default function NodeGraph3D({ className, scrollProgressRef }: Props) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        /* ── renderer ── */
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        /* ── scene + camera ── */
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xfaf8f2, 0.025);

        const camera = new THREE.PerspectiveCamera(
            55,
            mount.clientWidth / mount.clientHeight,
            0.1,
            200,
        );
        camera.position.set(0, 0, 28);

        /* ── lights ── */
        scene.add(new THREE.AmbientLight(0xffffff, 0.65));
        const key = new THREE.DirectionalLight(0x9bd301, 0.9);
        key.position.set(8, 12, 10);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0x706457, 0.55);
        rim.position.set(-12, -6, -8);
        scene.add(rim);

        /* ── nodes ── */
        type NodeRec = {
            mesh: THREE.Mesh;
            basePos: THREE.Vector3;
            phase: number;
            kind: 'in' | 'op' | 'out';
        };
        const nodes: NodeRec[] = [];

        const palette = {
            in: new THREE.Color(0x9bd301),
            op: new THREE.Color(0x857a6c),
            out: new THREE.Color(0xb8f030),
        };

        // Build a workflow-shaped layout: 3 columns (input → ops → output)
        const layout: { kind: NodeRec['kind']; pos: [number, number, number] }[] = [
            { kind: 'in', pos: [-10, 4, 0] },
            { kind: 'in', pos: [-10, -1, 1.5] },
            { kind: 'in', pos: [-10, -5, -1] },
            { kind: 'op', pos: [-3, 5, 2] },
            { kind: 'op', pos: [-3, 0, -2] },
            { kind: 'op', pos: [-3, -5, 1] },
            { kind: 'op', pos: [3, 3, 1.5] },
            { kind: 'op', pos: [3, -2, -1.5] },
            { kind: 'op', pos: [3, -6, 0.5] },
            { kind: 'out', pos: [10, 1.5, 0] },
            { kind: 'out', pos: [10, -3, -1] },
        ];

        const octaGeo = new THREE.OctahedronGeometry(0.7, 0);
        const cubeGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
        const sphGeo = new THREE.SphereGeometry(0.75, 24, 24);

        layout.forEach((n, i) => {
            const mat = new THREE.MeshStandardMaterial({
                color: palette[n.kind],
                roughness: 0.35,
                metalness: 0.45,
                emissive: palette[n.kind],
                emissiveIntensity: 0.15,
            });
            const geo = n.kind === 'in' ? octaGeo : n.kind === 'op' ? cubeGeo : sphGeo;
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(...n.pos);
            mesh.userData = { idx: i };
            scene.add(mesh);
            nodes.push({
                mesh,
                basePos: new THREE.Vector3(...n.pos),
                phase: Math.random() * Math.PI * 2,
                kind: n.kind,
            });

            // wireframe halo
            const halo = new THREE.Mesh(
                geo,
                new THREE.MeshBasicMaterial({
                    color: palette[n.kind],
                    wireframe: true,
                    transparent: true,
                    opacity: 0.18,
                }),
            );
            halo.scale.setScalar(1.4);
            mesh.add(halo);
        });

        /* ── edges (connect each input → some ops → outputs) ── */
        type EdgeRec = {
            a: number;
            b: number;
            line: THREE.Line;
            particle: THREE.Mesh;
            progress: number;
            speed: number;
        };
        const edges: EdgeRec[] = [];

        const edgePairs: [number, number][] = [
            [0, 3], [0, 4],
            [1, 4], [1, 5],
            [2, 5], [2, 4],
            [3, 6], [3, 7],
            [4, 7], [4, 8],
            [5, 8], [5, 7],
            [6, 9], [7, 9], [7, 10], [8, 10],
        ];

        const particleGeo = new THREE.SphereGeometry(0.13, 12, 12);
        const particleMat = new THREE.MeshBasicMaterial({ color: 0x9bd301 });

        edgePairs.forEach(([a, b]) => {
            const lineMat = new THREE.LineBasicMaterial({
                color: 0x9bd301,
                transparent: true,
                opacity: 0.25,
            });
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                nodes[a].mesh.position.clone(),
                nodes[b].mesh.position.clone(),
            ]);
            const line = new THREE.Line(lineGeo, lineMat);
            scene.add(line);

            const particle = new THREE.Mesh(particleGeo, particleMat.clone());
            scene.add(particle);

            edges.push({
                a, b, line, particle,
                progress: Math.random(),
                speed: 0.12 + Math.random() * 0.18,
            });
        });

        /* ── starfield backdrop ── */
        const starGeo = new THREE.BufferGeometry();
        const starCount = 320;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 80;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            starPos[i * 3 + 2] = -20 - Math.random() * 30;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const stars = new THREE.Points(
            starGeo,
            new THREE.PointsMaterial({
                color: 0x706457,
                size: 0.08,
                transparent: true,
                opacity: 0.5,
            }),
        );
        scene.add(stars);

        /* ── interaction ── */
        const mouse = new THREE.Vector2(0, 0);
        const target = new THREE.Vector2(0, 0);
        let dragging = false;
        let dragNode: NodeRec | null = null;
        const raycaster = new THREE.Raycaster();
        const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const dragOffset = new THREE.Vector3();

        const onPointerMove = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            target.x = mouse.x;
            target.y = mouse.y;

            if (dragging && dragNode) {
                raycaster.setFromCamera(mouse, camera);
                const hit = new THREE.Vector3();
                raycaster.ray.intersectPlane(dragPlane, hit);
                dragNode.mesh.position.copy(hit.sub(dragOffset));
            }
        };

        const onPointerDown = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(nodes.map((n) => n.mesh), false);
            if (intersects.length > 0) {
                dragging = true;
                dragNode = nodes[intersects[0].object.userData.idx];
                // anchor drag plane on node z, capture offset
                dragPlane.constant = -dragNode.mesh.position.z;
                const hit = new THREE.Vector3();
                raycaster.ray.intersectPlane(dragPlane, hit);
                dragOffset.copy(hit).sub(dragNode.mesh.position);
                renderer.domElement.style.cursor = 'grabbing';
            }
        };

        const onPointerUp = () => {
            if (dragNode) {
                // settle back toward base position over time (handled in loop)
                dragNode = null;
            }
            dragging = false;
            renderer.domElement.style.cursor = 'grab';
        };

        renderer.domElement.style.cursor = 'grab';
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);

        /* ── resize ── */
        const onResize = () => {
            if (!mount) return;
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        /* ── animation loop ── */
        let raf = 0;
        let t = 0;
        const camTarget = new THREE.Vector3(0, 0, 0);

        const tmp = new THREE.Vector3();

        const tick = () => {
            t += 0.012;

            // scroll progress drives camera dolly
            const sp = scrollProgressRef?.current ?? 0;
            const targetZ = 28 - sp * 14;
            const targetY = sp * 4;
            camera.position.x += (target.x * 3 - camera.position.x) * 0.04;
            camera.position.y += (target.y * 2 + targetY - camera.position.y) * 0.04;
            camera.position.z += (targetZ - camera.position.z) * 0.05;
            camera.lookAt(camTarget);

            // node float + return to base when not dragging
            nodes.forEach((n) => {
                if (n === dragNode) return;
                const fx = Math.sin(t * 0.8 + n.phase) * 0.25;
                const fy = Math.cos(t * 0.6 + n.phase * 1.3) * 0.3;
                const fz = Math.sin(t * 0.5 + n.phase * 0.7) * 0.2;
                const tx = n.basePos.x + fx;
                const ty = n.basePos.y + fy;
                const tz = n.basePos.z + fz;
                n.mesh.position.x += (tx - n.mesh.position.x) * 0.06;
                n.mesh.position.y += (ty - n.mesh.position.y) * 0.06;
                n.mesh.position.z += (tz - n.mesh.position.z) * 0.06;
                n.mesh.rotation.x += 0.004;
                n.mesh.rotation.y += 0.006;
            });

            // edges follow node positions, particles flow a→b
            edges.forEach((e) => {
                const a = nodes[e.a].mesh.position;
                const b = nodes[e.b].mesh.position;
                const pos = e.line.geometry.attributes.position as THREE.BufferAttribute;
                pos.setXYZ(0, a.x, a.y, a.z);
                pos.setXYZ(1, b.x, b.y, b.z);
                pos.needsUpdate = true;

                e.progress += e.speed * 0.012;
                if (e.progress > 1) e.progress -= 1;
                tmp.lerpVectors(a, b, e.progress);
                e.particle.position.copy(tmp);
                const mat = e.particle.material as THREE.MeshBasicMaterial;
                mat.opacity = 0.4 + 0.6 * Math.sin(e.progress * Math.PI);
                mat.transparent = true;
            });

            // stars subtle drift
            stars.rotation.y += 0.0006;
            stars.rotation.x += 0.0002;

            renderer.render(scene, camera);
            raf = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('pointerup', onPointerUp);
            renderer.domElement.removeEventListener('pointermove', onPointerMove);
            renderer.domElement.removeEventListener('pointerdown', onPointerDown);
            renderer.dispose();
            scene.traverse((o) => {
                const m = o as THREE.Mesh;
                if (m.geometry) m.geometry.dispose();
                if (m.material) {
                    const mat = m.material as THREE.Material | THREE.Material[];
                    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
                    else mat.dispose();
                }
            });
            if (renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, [scrollProgressRef]);

    return <div ref={mountRef} className={className} />;
}
