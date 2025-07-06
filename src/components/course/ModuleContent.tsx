"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  FiChevronLeft,
  FiCheck,
  FiCheckCircle,
  FiPlay,
  FiTarget,
} from "react-icons/fi";
import QuizComponent from "@/components/QuizComponent";

interface ContentBlock {
  id: string;
  type: string;
  title?: string;
  url?: string;
  html?: string;
  markdown?: string;
  text?: string;
  items?: string[];
  order?: number;
}

interface Module {
  title: string;
  contentBlocks: ContentBlock[];
  contentType?: string;
  outcome?: string;
}

interface ModuleContentProps {
  currentModule: Module;
  activeModule: number;
  courseLength: number;
  activeTab: "lesson" | "quiz";
  setActiveTab: (tab: "lesson" | "quiz") => void;
  setActiveModule: (i: number) => void;
  toggleModuleCompletion: (i: number) => void;
  quizData?: any[]; // optional if quiz exists
  isEnrolled?: boolean;
}

export default function ModuleContent({
  currentModule,
  activeModule,
  courseLength,
  activeTab,
  setActiveTab,
  setActiveModule,
  toggleModuleCompletion,
  quizData = [],
  isEnrolled = true,
}: ModuleContentProps) {
  const [userInput, setUserInput] = useState<Record<string, string>>({});

  const handleInputChange = (
    blockId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserInput((prev) => ({
      ...prev,
      [blockId]: e.target.value,
    }));
  };

  return (
    <motion.div
      key={activeTab === "quiz" ? "quiz" : `${activeModule}-content`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {activeTab === "quiz" ? (
        <QuizComponent
          questions={quizData}
          isEnrolled={isEnrolled}
          onSubmit={(results) => {
            if (results.score === results.totalQuestions) {
              toggleModuleCompletion(activeModule);
            }
          }}
        />
      ) : (
        <>
          {/* Content Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Module {activeModule + 1}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentModule?.title}
            </h2>
          </div>

          {/* Lesson Content (preserved + modularized logic) */}
          <div className="space-y-6">
            {currentModule?.contentBlocks?.map((block, idx, arr) => {
              if (
                block.type === "markdown" &&
                arr[idx + 1]?.type === "list"
              ) {
                const listBlock = arr[idx + 1];
                return (
                  <div
                    key={block.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 mb-4">
                      <ReactMarkdown
                        components={{
                          h3: ({ children }) => (
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6 first:mt-0">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-gray-700 leading-relaxed mb-4">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="space-y-2 mb-4">{children}</ul>
                          ),
                          li: ({ children }) => (
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                              <span>{children}</span>
                            </li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {block.markdown}
                      </ReactMarkdown>
                    </div>
                    <ul className="list-disc pl-6 space-y-2">
                      {listBlock.items?.map((item, i) => (
                        <li key={i} className="text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (
                block.type === "list" &&
                idx > 0 &&
                arr[idx - 1]?.type === "markdown"
              ) {
                return null;
              }

              switch (block.type) {
                case "video":

                  // Helper function to extract video URL from different formats
                  const getVideoUrl = (url: string) => {
                    if (!url) return null;

                    // If it's already an embed URL, use it directly
                    if (url.includes('youtube.com/embed/') || url.includes('youtu.be/embed/')) {
                      return url;
                    }

                    // Extract YouTube video ID from various formats
                    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                    const match = url.match(youtubeRegex);
                    if (match) {
                      return `https://www.youtube.com/embed/${match[1]}`;
                    }

                    // For other URLs, try to use them directly
                    return url;
                  };

                  const videoUrl = getVideoUrl(block.url || '');

                  return (
                    <div
                      key={block.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative group">
                        {videoUrl ? (
                          <iframe
                            src={videoUrl}
                            title={block.title || "Video Lesson"}
                            className="absolute top-0 left-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center text-white">
                              <FiPlay className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                              <h3 className="text-xl font-medium mb-2">
                                {block.title || "Video Not Available"}
                              </h3>
                              <p className="text-gray-400">
                                {block.url ? "Unable to load video" : "No video URL provided"}
                              </p>
                              {block.url && (
                                <a
                                  href={block.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Open Video Link
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );

                case "text":
                  return (
                    <div
                      key={block.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div
                        className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4"
                        dangerouslySetInnerHTML={{ __html: block.html ?? "" }}
                      />
                      <textarea
                        className="w-full border mt-4 border-gray-300 p-3 rounded-md h-40 resize-y"
                        placeholder="Write your notes here..."
                        value={userInput[block.id] || ""}
                        onChange={(e) => handleInputChange(block.id, e)}
                      />
                    </div>
                  );

                case "markdown":
                  return (
                    <div
                      key={block.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4">
                        {block.markdown ? (
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-2xl font-semibold text-gray-900 mb-5 mt-7 first:mt-0">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6 first:mt-0">
                                  {children}
                                </h3>
                              ),
                              h4: ({ children }) => (
                                <h4 className="text-lg font-semibold text-gray-900 mb-3 mt-5 first:mt-0">
                                  {children}
                                </h4>
                              ),
                              p: ({ children }) => (
                                <p className="text-gray-700 leading-relaxed mb-4">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-gray-700 leading-relaxed">
                                  {children}
                                </li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-gray-900">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic text-gray-700">
                                  {children}
                                </em>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">
                                  {children}
                                </blockquote>
                              ),
                              code: ({ children }) => (
                                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {block.markdown}
                          </ReactMarkdown>
                        ) : (
                          <div className="text-gray-500 italic">
                            No markdown content available
                          </div>
                        )}
                      </div>
                    </div>
                  );

                case "list":
                  return (
                    <div
                      key={block.id}
                      className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {block.items?.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                          >
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                              <FiCheck className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-gray-700 leading-relaxed font-medium">
                              {item}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );

                case "quote":
                  return (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 p-8 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <blockquote className="text-lg font-medium text-gray-800 italic pl-6 relative z-10">
                        {block.text}
                      </blockquote>
                    </motion.div>
                  );

                case "quiz":
                  return (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <FiCheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          Ready for a Quick Quiz?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Test your knowledge with this interactive quiz and solidify your learning
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab("quiz")}
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                        >
                          <FiPlay className="w-5 h-5" />
                          Start Quiz
                        </motion.button>
                      </div>
                    </motion.div>
                  );

                default:
                  return null;
              }
            })}

            {/* Learning Outcome Section */}
            {currentModule?.outcome && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FiTarget className="w-5 h-5" />
                  Learning Outcome
                </h4>
                <p className="text-blue-800">{currentModule.outcome}</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                if (activeModule > 0) setActiveModule(activeModule - 1);
              }}
              disabled={activeModule === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={() => {
                if (activeModule < courseLength - 1) setActiveModule(activeModule + 1);
              }}
              disabled={activeModule === courseLength - 1}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
              <FiPlay className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
