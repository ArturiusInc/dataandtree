import React, { useState, useEffect, useContext, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import * as CANNON from "cannon";

const context = React.createContext();

export function Provider({ children }) {
	const [world] = useState(() => new CANNON.World());
	useEffect(() => {
		world.broadphase = new CANNON.NaiveBroadphase();
		world.solver.iterations = 10;
		world.gravity.set(0, -20, 0);
	}, [world]);

	useFrame(() => world.step(1 / 60));
	return <context.Provider value={world} children={children} />;
}

export function useCannon({ ...props }, fn, deps = []) {
	const ref = useRef();
	const world = useContext(context);
	const [body] = useState(() => new CANNON.Body(props));
	new CANNON.Body();

	const { mouse } = useThree();
	useEffect(() => {
		fn(body);
		world.addBody(body);
		return () => world.removeBody(body);
	}, [body, fn, world]);

	useFrame(() => {
		if (ref.current) {
			ref.current.position.copy(body.position);
			body.quaternion.z = -mouse.x * 0.1;
			body.quaternion.x = -mouse.y * 0.1;
			ref.current.quaternion.copy(body.quaternion);
		}
	});

	return ref;
}
