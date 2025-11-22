"use client";
import type { FC } from "react";
import { useState } from "react";
import { Rect, Group, Text, Line } from "react-konva";
import type { KonvaColors } from "../hooks/useKonvaColors";

interface KonvaCardProps {
  x: number;
  y: number;
  colors: KonvaColors;
  seed: string;
  player1: string;
  player2?: string;
  winner?: string;
  isBye?: boolean;
  isFinal?: boolean;
  status?: "not-started" | "ongoing" | "finished";
  matchNumber: number;
  cardIndex?: number;
  isHighlighted?: boolean;
  onMouseEnter?: (cardIndex: number) => void;
  onMouseLeave?: () => void;
  onViewClick?: (matchData: {
    seed: string;
    player1: string;
    player2: string;
  }) => void;
}

export const KonvaCard: FC<KonvaCardProps> = ({
  x,
  y,
  colors,
  seed,
  player1,
  player2,
  winner,
  isBye,
  isFinal = false,
  status = "not-started",
  matchNumber,
  cardIndex = 0,
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  onViewClick,
}) => {
  // State for hover effects
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // Card dimensions and layout
  const cardWidth = 300;
  const cardHeight = isBye ? 62 : 90; // Reduced height for Bye cards
  const cornerRadius = 5;
  const padding = 10;
  const textPaddingX = 12;

  // Derived layout properties
  const headerHeight = 30;
  const separatorPoints = [1.5, headerHeight, cardWidth - 1.5, headerHeight];

  const seedTextY = padding;
  const seedFontSize = 12;

  const playerContentY = headerHeight;
  const playerText1Y = playerContentY + 10; // 40
  const playerText2Y = playerContentY + 35; // 65
  const playerFontSize = 15;

  const buttonHeight = 45;
  const buttonWidth = (cardWidth - padding * 2) / 4;
  const buttonX = cardWidth - buttonWidth - padding;
  const buttonY = 37;
  const buttonCornerRadius = 5;

  // Dynamic properties based on status and hover state
  const getStatusBorderColor = () => {
    if (isHighlighted || isCardHovered) return colors.primary;

    switch (status) {
      case "not-started":
        return "#6b7280"; // Gray
      case "ongoing":
        return "#3b82f6"; // Blue
      case "finished":
      default:
        return colors.border;
    }
  };

  const getStatusBackgroundColor = () => {
    switch (status) {
      case "not-started":
        return "#f9fafb"; // Light gray
      case "ongoing":
        return "#eff6ff"; // Light blue
      case "finished":
      default:
        return colors.card;
    }
  };



  const cardStrokeWidth = isCardHovered || isHighlighted ? 3 : 3;
  const cardStroke = getStatusBorderColor();
  const cardBackground = getStatusBackgroundColor();
  const cardShadowBlur = isHighlighted ? 0 : 0;
  const buttonOpacity = isButtonHovered ? 0.9 : 1;

  // Calculate background width based on button presence
  const playerBackgroundWidth = isBye ? cardWidth - 3 : buttonX - 12;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleCardMouseEnter = () => {
    setIsCardHovered(true);
    const container = document.querySelector("canvas")?.parentElement;
    if (container) {
      container.style.cursor = "pointer";
    }

    // Call parent's onMouseEnter with cardIndex
    if (onMouseEnter && cardIndex !== undefined) {
      onMouseEnter(cardIndex);
    }
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
    const container = document.querySelector("canvas")?.parentElement;
    if (container) {
      container.style.cursor = "default";
    }

    // Call parent's onMouseLeave
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  const handleButtonMouseEnter = () => {
    setIsButtonHovered(true);
  };

  const handleButtonMouseLeave = () => {
    setIsButtonHovered(false);
  };

  return (
    <Group
      x={x}
      y={isBye ? y + 15 : y}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    // draggable
    >


      {/* Seed Text */}
      <Text
        x={textPaddingX}
        y={seedTextY}
        text={`Seed: ${seed}`}
        fontSize={seedFontSize}
        fontFamily="Arial, sans-serif"
        fill={colors.mutedForeground}
        width={cardWidth}
        align="left"
      />

      {/* Match Number */}
      <Text
        x={cardWidth - 60}
        y={seedTextY}
        text={`#${matchNumber}`}
        fontSize={seedFontSize}
        fontFamily="Arial, sans-serif"
        fill={colors.mutedForeground}
        width={50}
        align="right"
      />

      {/* Separator Line */}
      <Line points={separatorPoints} stroke={colors.border} strokeWidth={1} />

      {/* Status Badge */}
      {status && (
        <>
          <Rect
            x={cardWidth / 2 - 45}
            y={seedTextY - 2}
            width={90}
            height={18}
            fill={
              status === "not-started"
                ? "#e5e7eb"
                : status === "ongoing"
                  ? "#dbeafe"
                  : "#d1fae5"
            }
            cornerRadius={4}
          />
          <Text
            x={cardWidth / 2 - 45}
            y={seedTextY}
            text={
              status === "not-started"
                ? "NOT STARTED"
                : status === "ongoing"
                  ? "ONGOING"
                  : "FINISHED"
            }
            fontSize={10}
            fontFamily="Arial, sans-serif"
            fontStyle="bold"
            fill={
              status === "not-started"
                ? "#6b7280"
                : status === "ongoing"
                  ? "#2563eb"
                  : "#059669"
            }
            width={90}
            align="center"
          />
        </>
      )}

      {/* Player 1 Background */}
      <Rect
        x={1.5}
        y={headerHeight + 1}
        width={playerBackgroundWidth}
        height={29}
        fill="#fee2e2" // Light Red for AKA
      />

      {/* Player 1 Name */}
      <Text
        x={textPaddingX}
        y={playerText1Y}
        text={truncateText(player1, 15) + (winner === player1 ? " 👑" : "")}
        fontSize={playerFontSize}
        fontFamily="Arial, sans-serif"
        fontStyle=""
        fill={colors.cardForeground}
        width={cardWidth}
        align="left"
      />

      {/* AKA Label */}
      <Text
        x={playerBackgroundWidth - 40}
        y={playerText1Y}
        text="AKA"
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontStyle="bold"
        fill="#991b1b" // Dark Red
        width={30}
        align="right"
      />

      {/* Player Separator Line */}
      {!isBye && player2 && (
        <Line
          points={[textPaddingX, playerText1Y + 20, cardWidth - textPaddingX - 80, playerText1Y + 20]}
          stroke={colors.border}
          strokeWidth={1}
        />
      )}

      {/* Player 2 Name */}
      {!isBye && player2 && (
        <>
          {/* Player 2 Background */}
          <Rect
            x={1.5}
            y={headerHeight + 30}
            width={playerBackgroundWidth}
            height={29}
            fill="#dbeafe" // Light Blue for AO
          />

          <Text
            x={textPaddingX}
            y={playerText2Y}
            text={truncateText(player2, 15) + (winner === player2 ? " 👑" : "")}
            fontSize={playerFontSize}
            fontFamily="Arial, sans-serif"
            fill={colors.cardForeground}
            width={cardWidth}
            align="left"
          />

          {/* AO Label */}
          <Text
            x={playerBackgroundWidth - 40}
            y={playerText2Y}
            text="AO"
            fontSize={10}
            fontFamily="Arial, sans-serif"
            fontStyle="bold"
            fill="#1e40af" // Dark Blue
            width={30}
            align="right"
          />
        </>
      )}

      {/* View ScoreBoard Button - Hide for Bye matches */}
      {
        !isBye && (
          <Group
            x={buttonX}
            y={buttonY}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            onClick={(e: any) => {
              e.cancelBubble = true;
              onViewClick?.({
                seed,
                player1,
                player2: player2 || "",
              });
            }}
            onTap={(e: any) => {
              e.cancelBubble = true;
              onViewClick?.({
                seed,
                player1,
                player2: player2 || "",
              });
            }}
            opacity={buttonOpacity}
          >
            <Rect
              width={buttonWidth}
              height={buttonHeight}
              fill={colors.primary}
              cornerRadius={buttonCornerRadius}
            />
            <Text
              text="View"
              fontSize={12}
              fontFamily="Arial, sans-serif"
              fill={colors.primaryForeground}
              width={buttonWidth}
              height={buttonHeight}
              align="center"
              verticalAlign="middle"
            />
            {/* Card Background */}

          </Group>
        )
      }
      <Rect
        width={cardWidth}
        height={cardHeight}
        stroke={cardStroke}
        strokeWidth={cardStrokeWidth}
        cornerRadius={cornerRadius}
        shadowBlur={cardShadowBlur}
        shadowColor={isHighlighted ? colors.primary : "transparent"}
      />
    </Group >
  );
};
