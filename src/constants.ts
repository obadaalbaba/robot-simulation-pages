//Define constants.

import { type Axis } from "./shared/types";

type Orientation = {
    axis: 'x' | 'y' | 'z';
    rotation: number;
};

type LinkOrientation = {
    [key in Axis]: Orientation;
};

const linkOrientation: LinkOrientation = {
    x: { axis: 'z', rotation: Math.PI / 2 },
    y: { axis: 'y', rotation: 0 },
    z: { axis: 'x', rotation: Math.PI / 2 }
};

const frameOrientation: LinkOrientation = {
    x: { axis: 'y', rotation: Math.PI / 2 },
    y: { axis: 'x', rotation: Math.PI / 2 },
    z: { axis: 'x', rotation: 0 }
};

export {
    linkOrientation,
    frameOrientation
};