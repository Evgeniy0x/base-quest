"use client";

import { useState } from "react";
import { Quest } from "@/lib/quests-data";

interface QuestPlayerProps {
  quest: Quest;
  onComplete: (questId: number, xp: number, correct: number) => void;
  onBack: () => void;
}

export default function QuestPlayer({
  quest,
  onComplete,
  onBack,
}: QuestPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const step = quest.steps[stepIndex];
  const progress = ((stepIndex + 1) / quest.steps.length) * 100;
  const isLastStep = stepIndex === quest.steps.length - 1;

  // Выбор ответа в квизе
  const handleAnswer = (optIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIndex);
    const correct = optIndex === step.correct;
    setIsCorrect(correct);
    if (correct) setCorrectCount((c) => c + 1);
  };

  // Следующий шаг или завершение
  const handleNext = () => {
    if (isLastStep) {
      onComplete(quest.id, quest.xp, correctCount);
    } else {
      setStepIndex(stepIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const canProceed = step.type !== "quiz" || selectedAnswer !== null;

  return (
    <div className="px-5 pb-10 min-h-screen animate-in">
      {/* Хедер */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="bg-white/10 border-none text-white w-9 h-9 rounded-[10px] cursor-pointer text-base"
        >
          ←
        </button>
        <span className="text-gray-500 text-[13px]">
          {stepIndex + 1} / {quest.steps.length}
        </span>
        <span className="text-base-blue text-[13px] font-semibold">
          +{quest.xp} XP
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-blue rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* === Обучающий шаг === */}
      {step.type === "learn" && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-base mx-auto mb-6 flex items-center justify-center text-[30px]">
            {quest.icon}
          </div>
          <h3 className="text-white text-[22px] font-extrabold mb-4">
            {step.title}
          </h3>
          <p className="text-gray-400 text-base leading-relaxed max-w-[340px] mx-auto">
            {step.content}
          </p>
        </div>
      )}

      {/* === Квиз === */}
      {step.type === "quiz" && (
        <div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-warning mx-auto mb-6 flex items-center justify-center text-[30px]">
            ❓
          </div>
          <h3 className="text-white text-xl font-extrabold text-center mb-6">
            {step.question}
          </h3>
          <div className="flex flex-col gap-2.5">
            {step.options?.map((opt, i) => {
              let classes = "bg-white/[0.06] border border-white/10";
              if (selectedAnswer !== null) {
                if (i === step.correct) {
                  classes =
                    "bg-emerald-500/15 border border-emerald-500";
                } else if (i === selectedAnswer && !isCorrect) {
                  classes = "bg-red-500/15 border border-red-500";
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`${classes} rounded-[14px] px-5 py-4 text-white text-[15px] text-left cursor-pointer transition-all duration-300`}
                  disabled={selectedAnswer !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <div
              className={`mt-4 p-3 rounded-xl text-center ${
                isCorrect
                  ? "bg-emerald-500/10"
                  : "bg-red-500/10"
              }`}
            >
              <span
                className={`font-bold text-[15px] ${
                  isCorrect ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* === Экшен (подключение кошелька и т.п.) === */}
      {step.type === "action" && (
        <div className="text-center">
          <div className="w-20 h-20 rounded-[20px] bg-gradient-base mx-auto mb-6 flex items-center justify-center text-4xl">
            👛
          </div>
          <h3 className="text-white text-[22px] font-extrabold mb-3">
            {step.title}
          </h3>
          <p className="text-gray-400 text-[15px] leading-relaxed mb-6">
            {step.content}
          </p>
          <button className="btn-primary mx-auto">
            {step.actionLabel || "Continue"}
          </button>
        </div>
      )}

      {/* Кнопка "Далее" */}
      <button
        onClick={handleNext}
        disabled={!canProceed}
        className="btn-primary w-full mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLastStep ? "Complete Quest 🎉" : "Continue →"}
      </button>
    </div>
  );
}
