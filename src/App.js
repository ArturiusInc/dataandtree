import React, { useState, useEffect } from "react";
import { useCannon, Provider } from "./useCannon";
import { Canvas } from "react-three-fiber";
import * as CANNON from "cannon";
import * as THREE from "three";
import PC from "./webRtc.class";
import "./App.css";

function Box({ position }) {
	const ref = useCannon({ mass: 0 }, (body) => {
		body.addShape(new CANNON.Box(new CANNON.Vec3(2.5, 0.05, 2.5)));
		body.position.set(...position);
	});

	return (
		<mesh receiveShadow ref={ref} scale={[1, 1, 1]}>
			<boxBufferGeometry attach="geometry" args={[5, 0.1, 5]} />
			<meshStandardMaterial attach="material" color={"orange"} />
		</mesh>
	);
}

function Sphere({ position }) {
	const [space, setSpace] = useState(false);
	const ref = useCannon(
		{ mass: 1 },
		(body) => {
			body.addShape(new CANNON.Sphere(0.3));
			if (space) {
				body.position.set(0, 3, 0);
			} else {
				body.position.set(...position);
			}
			setSpace(false);
		},
		[space]
	);

	const spacePress = React.useCallback((event) => {
		if (event.keyCode === 32) {
			setSpace(true);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("keyup", spacePress);
		return () => {
			document.removeEventListener("keyup", spacePress);
		};
	}, [spacePress]);

	return (
		<mesh ref={ref} castShadow receiveShadow scale={[1, 1, 1]}>
			<sphereBufferGeometry attach="geometry" args={[0.3, 32, 32]} />
			<meshStandardMaterial attach="material" roughness={0.5} color={"blue"} />
		</mesh>
	);
}

function App() {
	const [pc, setpc] = useState();
	const [mobile, setmobile] = useState(window.orientation);

	useEffect(() => {
		if (!pc) {
			setpc(new PC());
		} else {
			pc.call();
			pc.createOffer();
		}
	}, [pc]);

	return (
		<div className="App">
			<Canvas
				camera={{ position: [0, 3, 5] }}
				shadowMap
				colorManagement
				onCreated={({ gl }) => {
					gl.toneMapping = THREE.ACESFilmicToneMapping;
					gl.outputEncoding = THREE.sRGBEncoding;
				}}
			>
				<pointLight position={[0, 5, 10]} intensity={0.25} />
				<spotLight intensity={0.3} position={[0, 10, 10]} angle={0.2} penumbra={1} castShadow />
				<Provider>
					<Box position={[0, 0, 0]} />
					<Sphere position={[0, 3, 0]} />
				</Provider>
			</Canvas>
		</div>
	);
}

export default App;
