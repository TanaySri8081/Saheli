"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCamouflage } from "@/context/CamouflageContext";

export function CamouflageCalculator() {
  const { isCamouflaged, deactivateCamouflage } = useCamouflage();
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCamouflaged) {
      setDisplay("0");
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
    }
  }, [isCamouflaged]);

  if (!isCamouflaged) return null;

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      deactivateCamouflage();
    }, 1500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const performCalculation = (op: string, a: number, b: number): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const handleOperation = (nextOp: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const result = performCalculation(operation, prevValue, inputValue);
      setPrevValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const handleEquals = () => {
    // Secret exit code: if current display is "777" or calculation equals 777
    if (display === "777" || (prevValue === 777 && !operation)) {
      deactivateCamouflage();
      return;
    }

    const inputValue = parseFloat(display);

    if (operation && prevValue !== null) {
      const result = performCalculation(operation, prevValue, inputValue);
      // Double check secret trigger on result
      if (result === 777) {
        deactivateCamouflage();
        return;
      }
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col justify-end p-5 select-none font-sans"
      style={{ touchAction: "manipulation" }}
    >
      {/* Microscopic stealth header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-zinc-600 text-xs font-mono">
        <span
          onClick={deactivateCamouflage}
          className="opacity-20 hover:opacity-100 cursor-pointer p-1"
          title="Exit Disguise"
        >
          •
        </span>
        <span className="opacity-40">CALCULATOR</span>
        <span className="opacity-0">•</span>
      </div>

      {/* Main Number Display */}
      <div className="flex-1 flex items-end justify-end px-3 pb-6">
        <div className="text-right text-6xl sm:text-7xl font-light tracking-tight truncate font-mono">
          {display}
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto w-full pb-4">
        {/* Row 1 */}
        <button
          onClick={handleClear}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          className="h-16 rounded-full bg-zinc-400 text-black text-xl font-medium active:bg-zinc-300 transition-colors"
        >
          {display !== "0" ? "C" : "AC"}
        </button>
        <button
          onClick={handleToggleSign}
          className="h-16 rounded-full bg-zinc-400 text-black text-xl font-medium active:bg-zinc-300 transition-colors"
        >
          ±
        </button>
        <button
          onClick={handlePercent}
          className="h-16 rounded-full bg-zinc-400 text-black text-xl font-medium active:bg-zinc-300 transition-colors"
        >
          %
        </button>
        <button
          onClick={() => handleOperation("÷")}
          className={`h-16 rounded-full text-2xl font-medium transition-colors ${
            operation === "÷" ? "bg-white text-amber-500" : "bg-amber-500 text-white active:bg-amber-400"
          }`}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleDigit("7")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          7
        </button>
        <button
          onClick={() => handleDigit("8")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          8
        </button>
        <button
          onClick={() => handleDigit("9")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          9
        </button>
        <button
          onClick={() => handleOperation("×")}
          className={`h-16 rounded-full text-2xl font-medium transition-colors ${
            operation === "×" ? "bg-white text-amber-500" : "bg-amber-500 text-white active:bg-amber-400"
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleDigit("4")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          4
        </button>
        <button
          onClick={() => handleDigit("5")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          5
        </button>
        <button
          onClick={() => handleDigit("6")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          6
        </button>
        <button
          onClick={() => handleOperation("-")}
          className={`h-16 rounded-full text-2xl font-medium transition-colors ${
            operation === "-" ? "bg-white text-amber-500" : "bg-amber-500 text-white active:bg-amber-400"
          }`}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleDigit("1")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          1
        </button>
        <button
          onClick={() => handleDigit("2")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          2
        </button>
        <button
          onClick={() => handleDigit("3")}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          3
        </button>
        <button
          onClick={() => handleOperation("+")}
          className={`h-16 rounded-full text-2xl font-medium transition-colors ${
            operation === "+" ? "bg-white text-amber-500" : "bg-amber-500 text-white active:bg-amber-400"
          }`}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleDigit("0")}
          className="col-span-2 h-16 rounded-full bg-zinc-800 text-2xl font-light pl-7 text-left active:bg-zinc-700 transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="h-16 rounded-full bg-zinc-800 text-2xl font-light active:bg-zinc-700 transition-colors"
        >
          .
        </button>
        <button
          onClick={handleEquals}
          className="h-16 rounded-full bg-amber-500 text-white text-2xl font-medium active:bg-amber-400 transition-colors"
        >
          =
        </button>
      </div>
    </div>
  );
}
