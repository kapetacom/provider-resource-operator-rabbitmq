/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { BlockDefinition } from "@kapeta/schemas";
import { BlockTypeShapeProps } from "@kapeta/ui-web-types";
import {
  BlockHandle,
  BlockInstanceName,
  BlockName,
  BlockStatus,
  BlockVersion,
  useBlock,
} from "@kapeta/ui-web-components";
import React from "react";

export const QueueBlockShapeComponent = <TBlockType extends BlockDefinition>(
  props: BlockTypeShapeProps<TBlockType>
) => {
  // Scaling the topbar svg to fit the block
  const block = useBlock();
  const svgWidth = 238;
  const svgHeight = 176 * (props.width / svgWidth);

  return (
      <g
          className="block-node"
          style={{cursor: block.readOnly ? "default" : "move"}}
      >
        {/* Background */}
        <rect width={props.width} height={props.height} rx="6" fill="white"/>
        {/* Border */}
        <rect
            x="0.5"
            y="0.5"
            width={props.width - 1}
            height={props.height - 1}
            rx="5.5"
            fill="none"
            stroke="black"
            strokeOpacity="0.12"
        />
        {/* Consumer BG */}
        <mask id="consumer-mask">
          <rect x="0" y="0" width="23" height={props.height} fill="white"/>
        </mask>
        <rect
            x="1"
            y="1"
            rx="5"
            width={40}
            height={props.height - 2}
            fill="black"
            fillOpacity="0.12"
            strokeWidth={"0"}
            mask={"url(#consumer-mask)"}
        />

        {/* Provider BG */}
        <mask id="provider-mask">
          <rect x={props.width - 41 + 23 - 5.5} y="0" width="23" height={props.height} fill="white"/>
        </mask>
        <rect
            x={props.width - 41}
            y="1"
            rx="5"
            width={40}
            height={props.height - 2}
            fill="black"
            fillOpacity="0.12"
            strokeWidth={"0"}
            mask={"url(#provider-mask)"}
        />
        {/* Consumer icon */}
        <svg
            x={3}
            y={(props.height / 2) - 13.5}
            width="16" height="27"
            viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 26L8 27L10 27L10 26L8 26ZM8 -4.37114e-08L8 26L10 26L10 4.37114e-08L8 -4.37114e-08Z" fill="white"/>
          <path d="M2 26L2 27L4 27L4 26L2 26ZM2 -4.37114e-08L2 26L4 26L4 4.37114e-08L2 -4.37114e-08Z" fill="white"/>
          <path
              d="M7.35355 6.64645L7 6.29289L6.64645 6.64645L5.58895 7.70395L5.23571 8.05718L5.58863 8.41074L8.92192 11.75H1H0.5V12.25V13.75V14.25H1H8.92192L5.58863 17.5893L5.23571 17.9428L5.58895 18.2961L6.64645 19.3536L7 19.7071L7.35355 19.3536L13.3536 13.3536L13.7071 13L13.3536 12.6464L7.35355 6.64645Z"
              fill="white" stroke="#E0E0E0"/>
          <path d="M14 26L14 27L16 27L16 26L14 26ZM14 -4.37114e-08L14 26L16 26L16 4.37114e-08L14 -4.37114e-08Z"
                fill="white"/>
        </svg>


        {/* Provider icon */}
        <svg
            x={props.width - 21}
            y={(props.height / 2) - 13.5}
            width="16" height="27" viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 26L8 27L10 27L10 26L8 26ZM8 -4.37114e-08L8 26L10 26L10 4.37114e-08L8 -4.37114e-08Z" fill="white"/>
          <path d="M2 26L2 27L4 27L4 26L2 26ZM2 -4.37114e-08L2 26L4 26L4 4.37114e-08L2 -4.37114e-08Z" fill="white"/>
          <path
              d="M7.35355 6.64645L7 6.29289L6.64645 6.64645L5.58895 7.70395L5.23571 8.05718L5.58863 8.41074L8.92192 11.75H1H0.5V12.25V13.75V14.25H1H8.92192L5.58863 17.5893L5.23571 17.9428L5.58895 18.2961L6.64645 19.3536L7 19.7071L7.35355 19.3536L13.3536 13.3536L13.7071 13L13.3536 12.6464L7.35355 6.64645Z"
              fill="white" stroke="#E0E0E0"/>
          <path d="M14 26L14 27L16 27L16 26L14 26ZM14 -4.37114e-08L14 26L16 26L16 4.37114e-08L14 -4.37114e-08Z"
                fill="white"/>
        </svg>


        <svg fill="none" x={props.width - 22} y={-28}>
          <BlockStatus/>
        </svg>
        {/* Offset if block has error */}
        <svg
            fill="none"
            x={(props.width / 2) - 12}
            y={35}
            width={props.width - 22}
            viewBox="0 0 150 150"
        >
          <BlockInstanceName/>
        </svg>
        <svg fill="none" x={props.width / 2} y={75}>
          <BlockName/>
        </svg>

        <svg x={props.width / 2} y={95}>
          <BlockHandle/>
        </svg>

        <svg y={props.height - 20} x={props.width / 2}>
          <BlockVersion/>
        </svg>
      </g>
  );
};
