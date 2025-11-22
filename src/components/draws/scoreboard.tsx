'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ScoreboardProps {
    eventName?: string;
    akaPlayer: {
        name: string;
        organization: string;
        score: number;
    };
    aoPlayer: {
        name: string;
        organization: string;
        score: number;
    };
    timeRemaining?: number;
    isRunning?: boolean;
    onTimerToggle?: () => void;
    onTimerReset?: () => void;
    onAkaScore?: (action: 'add' | 'subtract', value: number) => void;
    onAoScore?: (action: 'add' | 'subtract', value: number) => void;
    selectedDuration?: string;
    onDurationChange?: (duration: string) => void;
}

export function Scoreboard({
    eventName = 'Event Details Here: U14 Kumite Final',
    akaPlayer = { name: 'Player 01', organization: 'Kenshin Kai', score: 1 },
    aoPlayer = { name: 'Player 02', organization: 'Kenshin Kai', score: 0 },
    timeRemaining = 180,
    isRunning = false,
    onTimerToggle = () => { },
    onTimerReset = () => { },
    onAkaScore = () => { },
    onAoScore = () => { },
    selectedDuration = '3.00',
    onDurationChange = () => { },
}: ScoreboardProps) {
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [editedTime, setEditedTime] = useState(timeRemaining.toString());

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeChange = (value: string) => {
        const seconds = parseInt(value) || 0;
        // This would need to be passed to parent component
        setEditedTime(value);
    };

    const handleTimeBlur = () => {
        setIsEditingTime(false);
        // Handle save logic here if needed
    };

    const durationOptions = ['0.30', '1.00', '1.30', '2.00', '2.30', '3.00'];
    const durationMap: Record<string, number> = {
        '0.30': 30,
        '1.00': 60,
        '1.30': 90,
        '2.00': 120,
        '2.30': 150,
        '3.00': 180,
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0a0e27' }}>
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white text-center">{eventName}</h1>
                </div>

                {/* Main Scoreboard Container */}
                <div className="flex items-center justify-between gap-6 mb-8">
                    {/* Left Player - AKA (Red) */}
                    <div className="flex-1">
                        <div
                            className="rounded-lg overflow-hidden shadow-lg"
                            style={{
                                width: '300px',
                                backgroundColor: '#1f2937',
                            }}
                        >
                            {/* Header */}
                            <div
                                className="px-6 py-4 text-white font-bold text-center"
                                style={{ backgroundColor: '#E63946' }}
                            >
                                AKA
                            </div>

                            {/* Player Info */}
                            <div className="px-6 py-4 bg-[#111827] text-center border-b border-gray-700">
                                <p className="text-white font-bold text-lg">{akaPlayer.name}</p>
                                <p className="text-gray-400 text-sm">{akaPlayer.organization}</p>
                            </div>

                            {/* Score Display */}
                            <div className="px-6 py-8 bg-[#111827] text-center border-b border-gray-700">
                                <p
                                    className="font-bold text-6xl"
                                    style={{ color: '#E63946' }}
                                >
                                    {akaPlayer.score}
                                </p>
                            </div>

                            {/* Penalty Buttons */}
                            <div className="px-6 py-4 bg-[#111827] flex flex-wrap gap-2 justify-center">
                                {['C1', 'C2', 'C3', 'HC', 'H'].map((btn) => (
                                    <button
                                        key={btn}
                                        className="w-10 h-10 rounded font-bold text-white text-xs transition-opacity hover:opacity-80 flex items-center justify-center"
                                        style={{ backgroundColor: '#E63946' }}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center - Timer */}
                    <div className="flex flex-col items-center gap-6">
                        <div
                            className="text-center rounded-lg p-8 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                                backgroundColor: '#1f2937',
                                minWidth: '350px',
                            }}
                            onClick={() => !isRunning && setIsEditingTime(true)}
                        >
                            {isEditingTime && !isRunning ? (
                                <Input
                                    type="number"
                                    value={editedTime}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    onBlur={handleTimeBlur}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleTimeBlur();
                                        if (e.key === 'Escape') {
                                            setIsEditingTime(false);
                                            setEditedTime(timeRemaining.toString());
                                        }
                                    }}
                                    autoFocus
                                    className="text-center bg-gray-800 text-white border-gray-600 text-6xl font-bold"
                                    style={{ fontSize: '120px' }}
                                />
                            ) : (
                                <p
                                    className="font-bold text-center"
                                    style={{
                                        fontSize: '140px',
                                        color: 'white',
                                        lineHeight: 1,
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {formatTime(timeRemaining)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Player - AO (Blue) */}
                    <div className="flex-1">
                        <div
                            className="rounded-lg overflow-hidden shadow-lg"
                            style={{
                                width: '300px',
                                backgroundColor: '#1f2937',
                                marginLeft: 'auto',
                            }}
                        >
                            {/* Header */}
                            <div
                                className="px-6 py-4 text-white font-bold text-center"
                                style={{ backgroundColor: '#4169E1' }}
                            >
                                AO
                            </div>

                            {/* Player Info */}
                            <div className="px-6 py-4 bg-[#111827] text-center border-b border-gray-700">
                                <p className="text-white font-bold text-lg">{aoPlayer.name}</p>
                                <p className="text-gray-400 text-sm">{aoPlayer.organization}</p>
                            </div>

                            {/* Score Display */}
                            <div className="px-6 py-8 bg-[#111827] text-center border-b border-gray-700">
                                <p
                                    className="font-bold text-6xl"
                                    style={{ color: '#4169E1' }}
                                >
                                    {aoPlayer.score}
                                </p>
                            </div>

                            {/* Penalty Buttons */}
                            <div className="px-6 py-4 bg-[#111827] flex flex-wrap gap-2 justify-center">
                                {['C1', 'C2', 'C3', 'HC', 'H'].map((btn) => (
                                    <button
                                        key={btn}
                                        className="w-10 h-10 rounded font-bold text-white text-xs transition-opacity hover:opacity-80 flex items-center justify-center"
                                        style={{ backgroundColor: '#4169E1' }}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Section */}
                <div
                    className="rounded-lg p-6 space-y-6"
                    style={{ backgroundColor: '#1f2937' }}
                >
                    {/* Timer Controls Row */}
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={onTimerToggle}
                            className="flex items-center gap-2 px-6 py-2 font-bold text-white rounded-lg transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#10b981' }}
                        >
                            {isRunning ? (
                                <>
                                    <Pause size={20} />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    Start
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={onTimerReset}
                            className="flex items-center gap-2 px-6 py-2 font-bold text-white rounded-lg transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#f59e0b' }}
                        >
                            <RotateCcw size={20} />
                            Reset ({formatTime(timeRemaining)})
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="flex items-center gap-2 px-6 py-2 font-semibold text-white rounded-lg border border-gray-600 bg-transparent hover:bg-gray-700"
                                >
                                    {selectedDuration}
                                    <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#111827] border-gray-600">
                                {durationOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onClick={() => onDurationChange(option)}
                                        className="text-white hover:bg-gray-700 cursor-pointer"
                                    >
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Score Adjustment Controls Row */}
                    <div className="flex items-center justify-center gap-8">
                        {/* AKA Score Controls */}
                        <div className="flex items-center gap-2">
                            <span className="text-white font-semibold mr-2">AKA Score:</span>
                            {['+1', '+2', '+3', '-1'].map((action) => (
                                <button
                                    key={action}
                                    onClick={() => {
                                        const isAdd = action.startsWith('+');
                                        const value = parseInt(action.replace('+', '').replace('-', ''));
                                        onAkaScore(isAdd ? 'add' : 'subtract', value);
                                    }}
                                    className="py-2 px-4 rounded font-bold text-white transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: '#E63946' }}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>

                        {/* AO Score Controls */}
                        <div className="flex items-center gap-2">
                            <span className="text-white font-semibold mr-2">AO Score:</span>
                            {['+1', '+2', '+3', '-1'].map((action) => (
                                <button
                                    key={action}
                                    onClick={() => {
                                        const isAdd = action.startsWith('+');
                                        const value = parseInt(action.replace('+', '').replace('-', ''));
                                        onAoScore(isAdd ? 'add' : 'subtract', value);
                                    }}
                                    className="py-2 px-4 rounded font-bold text-white transition-opacity hover:opacity-80"
                                    style={{ backgroundColor: '#4169E1' }}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
