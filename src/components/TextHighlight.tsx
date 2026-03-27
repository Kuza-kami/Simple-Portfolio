import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export type HighlightBit = { text: string; occurrence: number };

export interface TextHighlightProps {
  children: React.ReactNode;
  highlightedBits?: (string | HighlightBit)[];
  highlightColor?: string;
  highlightClassName?: string;
  blurAmount?: number;
  inactiveOpacity?: number;
  blurDelay?: number;
  blurDuration?: number;
  highlightDelay?: number;
  highlightDuration?: number;
  highlightDirection?: "left" | "right" | "top" | "bottom";
  viewportOptions?: { once?: boolean; amount?: number };
  className?: string;
}

const parseText = (text: string, bits: (string | HighlightBit)[]) => {
  if (!bits.length) return [{ text, isHighlight: false }];

  const normalizedBits = bits.map(bit =>
    typeof bit === 'string' ? { text: bit, occurrence: 0 } : bit
  );

  let matches: { start: number; end: number; text: string }[] = [];

  normalizedBits.forEach(bit => {
    let startIndex = 0;
    let occurrenceCount = 1;
    while ((startIndex = text.indexOf(bit.text, startIndex)) > -1) {
      if (bit.occurrence === 0 || bit.occurrence === occurrenceCount) {
        matches.push({ start: startIndex, end: startIndex + bit.text.length, text: bit.text });
      }
      startIndex += bit.text.length;
      occurrenceCount++;
    }
  });

  matches.sort((a, b) => a.start - b.start);

  const filteredMatches = [];
  let lastEnd = 0;
  for (const match of matches) {
    if (match.start >= lastEnd) {
      filteredMatches.push(match);
      lastEnd = match.end;
    }
  }

  const parts: { text: string; isHighlight: boolean }[] = [];
  let currentIndex = 0;
  for (const match of filteredMatches) {
    if (match.start > currentIndex) {
      parts.push({ text: text.substring(currentIndex, match.start), isHighlight: false });
    }
    parts.push({ text: match.text, isHighlight: true });
    currentIndex = match.end;
  }
  if (currentIndex < text.length) {
    parts.push({ text: text.substring(currentIndex), isHighlight: false });
  }

  return parts;
};

export const TextHighlight: React.FC<TextHighlightProps> = ({
  children,
  highlightedBits = [],
  highlightColor = "hsl(80, 100%, 50%)",
  highlightClassName = "",
  blurAmount = 8,
  inactiveOpacity = 0.3,
  blurDelay = 0,
  blurDuration = 0.8,
  highlightDelay = 0.4,
  highlightDuration = 1,
  highlightDirection = "left",
  viewportOptions = { once: false, amount: 0.5 },
  className = "",
}) => {
  const parts = useMemo(() => {
    if (typeof children === 'string') {
      return parseText(children, highlightedBits);
    }
    return [{ text: children as any, isHighlight: false }];
  }, [children, highlightedBits]);

  return (
    <motion.span
      initial={{ filter: `blur(${blurAmount}px)`, opacity: inactiveOpacity }}
      whileInView={{ filter: "blur(0px)", opacity: 1 }}
      viewport={{ ...viewportOptions, margin: "-20%" }}
      transition={{ duration: blurDuration, delay: blurDelay }}
      className={className}
    >
      {parts.map((part, i) => {
        if (!part.isHighlight) return <React.Fragment key={i}>{part.text}</React.Fragment>;

        return (
          <motion.span
            key={i}
            className={`relative inline-block ${highlightClassName}`}
          >
            <motion.span
              className="absolute inset-0 z-[-1] rounded-[inherit]"
              style={{ backgroundColor: highlightColor }}
              initial={{
                scaleX: highlightDirection === 'left' || highlightDirection === 'right' ? 0 : 1,
                scaleY: highlightDirection === 'top' || highlightDirection === 'bottom' ? 0 : 1,
                transformOrigin: highlightDirection === 'left' ? 'left' : highlightDirection === 'right' ? 'right' : highlightDirection === 'top' ? 'top' : 'bottom'
              }}
              whileInView={{ scaleX: 1, scaleY: 1 }}
              viewport={{ ...viewportOptions, margin: "-20%" }}
              transition={{ duration: highlightDuration, delay: highlightDelay, ease: "easeOut" }}
            />
            {part.text}
          </motion.span>
        );
      })}
    </motion.span>
  );
};
