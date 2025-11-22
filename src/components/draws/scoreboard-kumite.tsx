'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useScoreboardStore } from '@/stores/scoreboard.store';

interface KumiteScoreboardProps {
    eventName?: string;
}

interface TimerEditorProps {
    minutes: number;
    seconds: number;
    onSave: (totalSeconds: number) => void;
    onCancel: () => void;
}

// Separate timer editor component with split minutes and seconds
function TimerEditor({ minutes, seconds, onSave, onCancel }: TimerEditorProps) {
    const [editMinutes, setEditMinutes] = useState(String(minutes).padStart(2, '0'));
    const [editSeconds, setEditSeconds] = useState(String(seconds).padStart(2, '0'));
    const minutesRef = useRef<HTMLInputElement>(null);
    const secondsRef = useRef<HTMLInputElement>(null);

    const handleMinutesChange = (value: string) => {
        // Remove non-digits
        const filtered = value.replace(/[^\d]/g, '');
        // Limit to 2 characters - but don't pad yet during editing
        if (filtered.length <= 2) {
            setEditMinutes(filtered);
        }
    };

    const handleSecondsChange = (value: string) => {
        // Remove non-digits
        const filtered = value.replace(/[^\d]/g, '');
        // Limit to 2 characters
        if (filtered.length <= 2) {
            const num = parseInt(filtered) || 0;
            // Cap at 59 for seconds
            if (num <= 59) {
                setEditSeconds(filtered);
            } else {
                setEditSeconds('59');
            }
        }
    };

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const mins = parseInt(editMinutes) || 0;
        const secs = parseInt(editSeconds) || 0;
        const totalSeconds = mins * 60 + Math.min(secs, 59);
        onSave(totalSeconds);
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const mins = parseInt(editMinutes) || 0;
            const secs = parseInt(editSeconds) || 0;
            const totalSeconds = mins * 60 + Math.min(secs, 59);
            onSave(totalSeconds);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (e.currentTarget === minutesRef.current) {
                secondsRef.current?.focus();
            } else {
                minutesRef.current?.focus();
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-4 bg-muted rounded-lg w-full">
            {/* Inputs Row */}
            <div className="flex items-center justify-center gap-3">
                {/* Minutes Input */}
                <div className="flex flex-col items-center gap-2">
                    <input
                        ref={minutesRef}
                        type="text"
                        inputMode="numeric"
                        value={editMinutes}
                        onChange={(e) => handleMinutesChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        maxLength={2}
                        className="text-center border-2 border-orange-400 font-bold rounded text-foreground"
                        style={{
                            fontSize: '100px',
                            lineHeight: '1',
                            fontFamily: 'monospace',
                            width: '180px',
                            height: '180px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'hsl(var(--input))',
                            color: 'hsl(var(--foreground))',
                        }}
                    />
                    <span className="text-foreground text-sm font-medium">Minutes</span>
                </div>

                {/* Separator */}
                <div className="text-foreground font-bold mb-4" style={{ fontSize: '100px', lineHeight: '1' }}>
                    :
                </div>

                {/* Seconds Input */}
                <div className="flex flex-col items-center gap-2">
                    <input
                        ref={secondsRef}
                        type="text"
                        inputMode="numeric"
                        value={editSeconds}
                        onChange={(e) => handleSecondsChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={2}
                        className="text-center border-2 border-orange-400 font-bold rounded text-foreground"
                        style={{
                            fontSize: '100px',
                            lineHeight: '1',
                            fontFamily: 'monospace',
                            width: '180px',
                            height: '180px',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'hsl(var(--input))',
                            color: 'hsl(var(--foreground))',
                        }}
                    />
                    <span className="text-foreground text-sm font-medium">Seconds</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onMouseDown={handleSave}
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold px-6 py-2 rounded cursor-pointer transition-colors text-sm"
                >
                    Save
                </button>
                <button
                    type="button"
                    onMouseDown={handleCancel}
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold px-6 py-2 rounded cursor-pointer transition-colors text-sm"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export function KumiteScoreboard({
    eventName = 'Event Details Here: U14 Kumite Final',
}: KumiteScoreboardProps) {
    const [isEditingTime, setIsEditingTime] = useState(false);
    const timeRef = useRef(0);

    // Get all kumite state and actions from store
    const kumite = useScoreboardStore((state) => state.kumite);
    const startKumiteTimer = useScoreboardStore((state) => state.startKumiteTimer);
    const pauseKumiteTimer = useScoreboardStore((state) => state.pauseKumiteTimer);
    const resetKumiteTimer = useScoreboardStore((state) => state.resetKumiteTimer);
    const setKumiteTimeRemaining = useScoreboardStore((state) => state.setKumiteTimeRemaining);
    const setKumiteTime = useScoreboardStore((state) => state.setKumiteTime);
    const updateKumiteScore = useScoreboardStore((state) => state.updateKumiteScore);
    const setKumiteSelectedDuration = useScoreboardStore((state) => state.setKumiteSelectedDuration);

    // Update ref when timeRemaining changes from store (editing or external changes)
    useEffect(() => {
        timeRef.current = kumite.timeRemaining;
    }, [kumite.timeRemaining]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer interval effect - countdown when running (only depends on isRunning)
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (kumite.isRunning && timeRef.current > 0) {
            intervalId = setInterval(() => {
                timeRef.current = Math.max(0, timeRef.current - 1);
                setKumiteTimeRemaining(timeRef.current);
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [kumite.isRunning, setKumiteTimeRemaining]);

    const handleTimerSave = (totalSeconds: number) => {
        // Set both timeRemaining and baseTime to the edited value
        setKumiteTime(totalSeconds, totalSeconds);
        setIsEditingTime(false);
    };

    const handleTimerCancel = () => {
        setIsEditingTime(false);
    };

    const handleTimerToggle = () => {
        if (kumite.isRunning) {
            pauseKumiteTimer();
        } else {
            startKumiteTimer();
        }
    };

    const handleTimerReset = () => {
        resetKumiteTimer();
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

    const handleDurationChange = (duration: string) => {
        const seconds = durationMap[duration];
        setKumiteTime(seconds, seconds);
        setKumiteSelectedDuration(duration);
    };

    const handleAkaScore = (action: 'add' | 'subtract', value: number) => {
        updateKumiteScore('aka', action, value);
    };

    const handleAoScore = (action: 'add' | 'subtract', value: number) => {
        updateKumiteScore('ao', action, value);
    };

    const akaPlayer = {
        name: 'Player 01',
        organization: 'Kenshin Kai',
        score: kumite.akaScore,
    };

    const aoPlayer = {
        name: 'Player 02',
        organization: 'Kenshin Kai',
        score: kumite.aoScore,
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-center">{eventName}</h1>
                </div>

                {/* Main Scoreboard Container */}
                <div className="flex items-center justify-between gap-6 mb-8">
                    {/* Left Player - AKA (Red) */}
                    <div className="flex-1">
                        <div
                            className="rounded-lg overflow-hidden shadow-lg bg-card"
                            style={{
                                width: '300px',
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
                            <div className="px-6 py-4 bg-card text-card-foreground text-center border-b border-border">
                                <p className="text-white font-bold text-lg">{akaPlayer.name}</p>
                                <p className="text-gray-400 text-sm">{akaPlayer.organization}</p>
                            </div>

                            {/* Score Display */}
                            <div className="px-6 py-8 bg-card text-center border-b border-border">
                                <p
                                    className="font-bold text-6xl"
                                    style={{ color: '#E63946' }}
                                >
                                    {akaPlayer.score}
                                </p>
                            </div>

                            {/* Penalty Buttons */}
                            <div className="px-6 py-4 bg-card flex flex-wrap gap-2 justify-center border-b border-border">
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
                    <div className="flex flex-col items-center gap-6 flex-shrink-0">
                        <div
                            className="text-center rounded-lg p-8 cursor-pointer hover:opacity-80 transition-opacity bg-card"
                            style={{
                                minWidth: '320px',
                            }}
                            onClick={() => !kumite.isRunning && setIsEditingTime(true)}
                        >
                            {isEditingTime && !kumite.isRunning ? (
                                <TimerEditor
                                    minutes={Math.floor(kumite.timeRemaining / 60)}
                                    seconds={kumite.timeRemaining % 60}
                                    onSave={handleTimerSave}
                                    onCancel={handleTimerCancel}
                                />
                            ) : (
                                <p
                                    className="font-bold text-center text-foreground"
                                    style={{
                                        fontSize: '140px',
                                        lineHeight: 1,
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {formatTime(kumite.timeRemaining)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Player - AO (Blue) */}
                    <div className="flex-shrink-0">
                        <div
                            className="rounded-lg overflow-hidden shadow-lg bg-card"
                            style={{
                                width: '300px',
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
                            <div className="px-6 py-4 bg-card text-card-foreground text-center border-b border-border">
                                <p className="text-white font-bold text-lg">{aoPlayer.name}</p>
                                <p className="text-gray-400 text-sm">{aoPlayer.organization}</p>
                            </div>

                            {/* Score Display */}
                            <div className="px-6 py-8 bg-card text-center border-b border-border">
                                <p
                                    className="font-bold text-6xl"
                                    style={{ color: '#4169E1' }}
                                >
                                    {aoPlayer.score}
                                </p>
                            </div>

                            {/* Penalty Buttons */}
                            <div className="px-6 py-4 bg-card flex flex-wrap gap-2 justify-center border-b border-border">
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
                    className="rounded-lg p-6 space-y-6 bg-card"
                >
                    {/* Timer Controls Row */}
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            onClick={handleTimerToggle}
                            className="flex items-center gap-2 px-6 py-2 font-bold text-white rounded-lg transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#10b981' }}
                        >
                            {kumite.isRunning ? (
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
                            onClick={handleTimerReset}
                            className="flex items-center gap-2 px-6 py-2 font-bold text-white rounded-lg transition-opacity hover:opacity-80"
                            style={{ backgroundColor: '#f59e0b' }}
                        >
                            <RotateCcw size={20} />
                            Reset ({formatTime(kumite.baseTime)})
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="flex items-center gap-2 px-6 py-2 font-semibold text-white rounded-lg border border-gray-600 bg-transparent hover:bg-gray-700"
                                >
                                    {kumite.selectedDuration}
                                    <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#111827] border-gray-600">
                                {durationOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onClick={() => handleDurationChange(option)}
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
                                        handleAkaScore(isAdd ? 'add' : 'subtract', value);
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
                                        handleAoScore(isAdd ? 'add' : 'subtract', value);
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
