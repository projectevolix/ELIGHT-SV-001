// react-konva.d.ts
declare module 'react-konva' {
  import * as React from 'react';
  import * as Konva from 'konva';

  export interface KonvaNodeEvents {
    onMouseOver?: (evt: any) => void;
    onMouseOut?: (evt: any) => void;
    onMouseEnter?: (evt: any) => void;
    onMouseLeave?: (evt: any) => void;
    onMouseMove?: (evt: any) => void;
    onMouseDown?: (evt: any) => void;
    onMouseUp?: (evt: any) => void;
    onClick?: (evt: any) => void;
    onDblClick?: (evt: any) => void;
    onTouchStart?: (evt: any) => void;
    onTouchMove?: (evt: any) => void;
    onTouchEnd?: (evt: any) => void;
    onTap?: (evt: any) => void;
    onDblTap?: (evt: any) => void;
    onDragStart?: (evt: any) => void;
    onDragMove?: (evt: any) => void;
    onDragEnd?: (evt: any) => void;
  }

  export interface StageProps extends KonvaNodeEvents {
    width: number;
    height: number;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface LayerProps extends KonvaNodeEvents {
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface ArcProps extends KonvaNodeEvents {
    x?: number;
    y?: number;
    innerRadius?: number;
    outerRadius?: number;
    angle?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    [key: string]: any;
  }

  export const Stage: React.FC<StageProps>;
  export const Layer: React.FC<LayerProps>;
  export const Arc: React.FC<ArcProps>;
  
  // Add other components as needed
  export const Rect: React.FC<any>;
  export const Circle: React.FC<any>;
  export const Ellipse: React.FC<any>;
  export const Line: React.FC<any>;
  export const Image: React.FC<any>;
  export const Text: React.FC<any>;
  export const TextPath: React.FC<any>;
  export const Star: React.FC<any>;
  export const Label: React.FC<any>;
  export const Path: React.FC<any>;
  export const RegularPolygon: React.FC<any>;
  export const Arrow: React.FC<any>;
  export const Shape: React.FC<any>;
  export const Group: React.FC<any>;
  export const Transformer: React.FC<any>;
}