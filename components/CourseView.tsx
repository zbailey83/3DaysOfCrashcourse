import React, { useState, useEffect } from 'react';
import { Course, Module, QuizQuestion } from '../types';
import { CheckCircle, PlayCircle, FileText, HelpCircle, ChevronRight, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
const isCorrect = selected === question.correctAnswer;

return (
  <div className="mb-8 last:mb-0">
    <p className="font-bold text-[#0F172A] mb-4 text-lg">{index + 1}. {question.question}</p>
    <div className="space-y-3">
      {question.options.map((opt, idx) => (
        <button
          key={idx}
          disabled={isSubmitted}
          onClick={() => setSelected(idx)}
          className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${isSubmitted
              ? idx === question.correctAnswer
                ? 'bg-[#10B981]/10 border-[#10B981] text-[#065F46]'
                : idx === selected
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-white border-transparent text-slate-400'
              : selected === idx
                ? 'bg-white border-[#2563EB] text-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.1)]'
                : 'bg-white border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md text-[#475569]'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
    {!isSubmitted && selected !== null && (
      <button
        onClick={() => setIsSubmitted(true)}
        className="mt-5 text-sm font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-8 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
      >
        Submit Answer
      </button>
    )}
    {isSubmitted && (
      <div className={`mt-5 p-5 rounded-2xl text-sm flex items-start animate-fade-in ${isCorrect ? 'bg-[#10B981]/10 text-[#065F46]' : 'bg-red-50 text-red-800'}`}>
        <div className={`mr-3 mt-0.5 p-1 rounded-full ${isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>
          {isCorrect ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
        </div>
        <div>
          <span className="font-bold block mb-1 text-base">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
          <p className="opacity-90 leading-relaxed">{question.explanation}</p>
        </div>
      </div>
    )}
  </div>
);
};