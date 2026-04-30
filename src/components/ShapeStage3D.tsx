import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════
   ShapeStage3D
   - Bold geometric shapes, large blocks of color
   - Bauhaus-inspired composition, NOT scattered nodes
   - Composition stays to one side / background, never overlaps text
   ═══════════════════════════════════════════════════════════ */

type Props = {
    className?: string;
    scrollProgressRef?: React.MutableRefObject<number>;
};

export default function ShapeStage3D({ className, scrollProgressRef }: Props) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            50,
            mount.clientWidth / mount.clientHeight,
            0.1,
            200,
        );
        camera.position.set(0, 0, 22);

        /* ── lights: dramatic, multi-color rim ── */
        scene.add(new THREE.AmbientLight(0xffffff, 0.55));

        const key = new THREE.DirectionalLight(0xffffff, 1.1);
        key.position.set(6, 10, 12);
        scene.add(key);

        const rimPink = new THREE.PointLight(0xff5c8a, 1.2, 40);
        rimPink.position.set(-12, 4, 6);
        scene.add(rimPink);

        const rimBlue = new THREE.PointLight(0x2d5bff, 1.0, 40);
        rimBlue.position.set(12, -4, 8);
        scene.add(rimBlue);

        const rimMint = new THREE.PointLight(0x34d6b0, 0.7, 35);
        rimMint.position.set(0, 12, -4);
        scene.add(rimMint);

        /* ── palette: Bauhaus / playful ── */
        const palette = {
            pink: 0xf8b5c0,
            coral: 0xff5722,
            blue: 0x2d5bff,
            mint: 0x34d6b0,
            yellow: 0xffc844,
            cream: 0xf2efe5,
            ink: 0x1a1714,
        };

        /* ── shapes: large, bold, composed (not scattered) ── */
        type ShapeRec = {
            mesh: THREE.Mesh;
            basePos: THREE.Vector3;
            baseRot: THREE.Euler;
            spin: THREE.Vector3;
            phase: number;
            floatAmp: number;
        };
        const shapes: ShapeRec[] = [];

        const matFlat = (color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.45,
                metalness: 0.15,
                flatShading: true,
                ...opts,
            });

        // Composition: stacked / clustered like Bauhaus collage on the right side
        const composition: {
            geo: THREE.BufferGeometry;
            mat: THREE.Material;
            pos: [number, number, number];
            rot?: [number, number, number];
            scale?: number;
            spin?: [number, number, number];
            floatAmp?: number;
        }[] = [
                // Large coral torus — anchor
                {
                    geo: new THREE.TorusGeometry(3.2, 0.9, 16, 48),
                    mat: matFlat(palette.coral, { metalness: 0.25 }),
                    pos: [4, 1, 0],
                    rot: [0.3, 0.4, 0.1],
                    spin: [0.001, 0.003, 0],
                    floatAmp: 0.4,
                },
                // Big mint hemisphere
                {
                    geo: new THREE.SphereGeometry(2.4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
                    mat: matFlat(palette.mint),
                    pos: [-3.5, -2.5, 1],
                    rot: [Math.PI, 0, 0.2],
                    spin: [0, 0.002, 0],
                    floatAmp: 0.5,
                },
                // Yellow cylinder slab
                {
                    geo: new THREE.CylinderGeometry(1.6, 1.6, 0.6, 48),
                    mat: matFlat(palette.yellow, { metalness: 0.3 }),
                    pos: [-5, 3, -2],
                    rot: [Math.PI / 2.3, 0, 0.3],
                    spin: [0.002, 0, 0.003],
                    floatAmp: 0.6,
                },
                // Blue cube — strong primary
                {
                    geo: new THREE.BoxGeometry(2.2, 2.2, 2.2),
                    mat: matFlat(palette.blue, { metalness: 0.2 }),
                    pos: [0.5, -3.8, 2],
                    rot: [0.5, 0.6, 0.2],
                    spin: [0.003, 0.004, 0],
                    floatAmp: 0.5,
                },
                // Pink pill (capsule)
                {
                    geo: new THREE.CapsuleGeometry(0.9, 3.2, 8, 16),
                    mat: matFlat(palette.pink),
                    pos: [6, -3, -1],
                    rot: [0.3, 0, -0.6],
                    spin: [0, 0.002, 0.001],
                    floatAmp: 0.55,
                },
                // Small accent: olive cone
                {
                    geo: new THREE.ConeGeometry(0.85, 1.8, 24),
                    mat: matFlat(0x9bd301, { metalness: 0.3 }),
                    pos: [-1, 5, 1.5],
                    rot: [0.2, 0.2, -0.4],
                    spin: [0, 0.005, 0],
                    floatAmp: 0.7,
                },
                // Cream plate (background, soft)
                {
                    geo: new THREE.CircleGeometry(5, 64),
                    mat: new THREE.MeshBasicMaterial({ color: palette.cream, transparent: true, opacity: 0.18 }),
                    pos: [-2, 1, -6],
                    rot: [0, 0, 0],
                    floatAmp: 0,
                },
                // Ink dot — small contrast
                {
                    geo: new THREE.SphereGeometry(0.6, 24, 24),
                    mat: matFlat(palette.ink, { metalness: 0.6, roughness: 0.2 }),
                    pos: [3.5, 4.5, 1],
                    spin: [0, 0.004, 0],
                    floatAmp: 0.5,
                },
            ];

        composition.forEach((c) => {
            const mesh = new THREE.Mesh(c.geo, c.mat);
            mesh.position.set(...c.pos);
            if (c.rot) mesh.rotation.set(...c.rot);
            if (c.scale) mesh.scale.setScalar(c.scale);
            scene.add(mesh);
            shapes.push({
                mesh,
                basePos: new THREE.Vector3(...c.pos),
                baseRot: mesh.rotation.clone(),
                spin: new THREE.Vector3(...(c.spin ?? [0, 0, 0])),
                phase: Math.random() * Math.PI * 2,
                floatAmp: c.floatAmp ?? 0.3,
            });
        });

        /* ── thin black connecting line (Bauhaus accent) ── */
        const lineMat = new THREE.LineBasicMaterial({ color: palette.ink, transparent: true, opacity: 0.35 });
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-8, 0, -1),
            new THREE.Vector3(8, 0, -1),
        ]);
        const accentLine = new THREE.Line(lineGeo, lineMat);
        scene.add(accentLine);

        /* ── interaction: gentle parallax + drag-rotate group ── */
        const group = new THREE.Group();
        // re-parent shapes into group for unified rotation
        shapes.forEach((s) => group.add(s.mesh));
        group.add(accentLine);
        scene.add(group);

        const mouse = new THREE.Vector2(0, 0);
        const target = new THREE.Vector2(0, 0);
        let dragging = false;
        let dragStart = { x: 0, y: 0, rx: 0, ry: 0 };

        const onPointerMove = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            target.x = mouse.x;
            target.y = mouse.y;

            if (dragging) {
                const dx = (e.clientX - dragStart.x) * 0.005;
                const dy = (e.clientY - dragStart.y) * 0.005;
                group.rotation.y = dragStart.ry + dx;
                group.rotation.x = dragStart.rx + dy;
            }
        };

        const onPointerDown = (e: PointerEvent) => {
            dragging = true;
            dragStart = { x: e.clientX, y: e.clientY, rx: group.rotation.x, ry: group.rotation.y };
            renderer.domElement.style.cursor = 'grabbing';
        };

        const onPointerUp = () => {
            dragging = false;
            renderer.domElement.style.cursor = 'grab';
        };

        renderer.domElement.style.cursor = 'grab';
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);

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

        const tick = () => {
            t += 0.012;
            const sp = scrollProgressRef?.current ?? 0;

            // camera dolly + slight pan as you scroll
            const targetZ = 22 - sp * 8;
            camera.position.z += (targetZ - camera.position.z) * 0.05;
            camera.position.x += (target.x * 1.2 - camera.position.x) * 0.04;
            camera.position.y += (target.y * 0.8 - camera.position.y) * 0.04;
            camera.lookAt(0, 0, 0);

            // group ambient rotation (when not dragging)
            if (!dragging) {
                group.rotation.y += 0.0015;
                group.rotation.x += (target.y * 0.15 - group.rotation.x) * 0.03;
            }

            // each shape: float + spin
            shapes.forEach((s) => {
                const fy = Math.sin(t * 0.7 + s.phase) * s.floatAmp;
                const fx = Math.cos(t * 0.5 + s.phase * 1.3) * s.floatAmp * 0.6;
                s.mesh.position.x = s.basePos.x + fx;
                s.mesh.position.y = s.basePos.y + fy;
                s.mesh.rotation.x += s.spin.x;
                s.mesh.rotation.y += s.spin.y;
                s.mesh.rotation.z += s.spin.z;
            });

            // scroll-driven scale pulse on entire composition
            const groupScale = 1 - sp * 0.15;
            group.scale.setScalar(groupScale);

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
