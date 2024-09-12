"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";
import BackgroundStars from "@/assets/stars.png";
import BackgroundGrid from "@/assets/grid-lines.png";
import { ActionButton } from "@/components/action-button";

// Custom Hook for Relative Mouse Position
const useRelativeMousePosition = (to: React.RefObject<HTMLElement>) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const updateMousePosition = (event: MouseEvent) => {
        if (!to.current) return;
        const { top, left } = to.current.getBoundingClientRect();
        mouseX.set(event.x - left);
        mouseY.set(event.y - top);
    };

    useEffect(() => {
        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);

    return [mouseX, mouseY];
};

const ChatbotPage: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const borderedDivRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState<string>("");
    const [greetingVisible, setGreetingVisible] = useState(true);
    const [queriesAndResponses, setQueriesAndResponses] = useState<Array<{ query: string, response: string }>>([]);
    const [lexoraVisible, setLexoraVisible] = useState(false); // New state for Lexora-AI visibility

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
    const backgroundPositionY = useTransform(scrollYProgress, [0, 1], [-300, 300]);

    const [mouseX, mouseY] = useRelativeMousePosition(borderedDivRef);
    const maskImage = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px, black, transparent)`;

    const handleClick = () => {
        if (message.trim() !== "") {
            setGreetingVisible(false);  // Hide greeting message
            const newQuery = message;
            const newResponse = "This is a sample response to the query.";  // Replace with actual logic to fetch the response

            // Update the queries and responses array
            setQueriesAndResponses([...queriesAndResponses, { query: newQuery, response: newResponse }]);
            setMessage("");  // Clear the message box

            // Show Lexora-AI after the query and solution box appears
            setLexoraVisible(true);
        }
    };

    return (
        <main className="h-screen w-full flex items-center justify-center overflow-hidden relative">
            {/* Stars animation across the entire background */}
            <motion.div
                animate={{ backgroundPositionX: BackgroundStars.width }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0"
                style={{ backgroundImage: `url(${BackgroundStars.src})` }}
            />
            <section className="relative z-10 w-full h-full flex items-center justify-center" ref={sectionRef} id="content">
                <motion.div
                    className="border border-muted px-12 rounded-xl overflow-hidden relative group"
                    style={{
                        backgroundImage: `url(${BackgroundStars.src})`,
                        backgroundPositionY,
                        width: "95%", // Adjusted width for equal margins
                        maxWidth: "1600px", // Max width for larger screens
                        height: "90vh", // Keeping height the same
                        backgroundColor: "transparent", // Change to match background screen color
                    }}
                >
                    <div
                        className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0 transition duration-700"
                        style={{ backgroundImage: `url(${BackgroundGrid.src})` }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-[rgb(74,32,138)] bg-blend-overlay opacity-0 group-hover:opacity-100 transition duration-700"
                        style={{ backgroundImage: `url(${BackgroundGrid.src})`, maskImage }}
                        ref={borderedDivRef}
                    />
                    {/* Container for Lexora-AI and Query Box */}
                    <div className="relative flex flex-col h-full">
                        {/* Lexora-AI Heading */}
                        {lexoraVisible && (
                            <div className="absolute top-4 left-0 w-full text-center">
                                <h2 className="text-5xl tracking-tighter font-medium text-white">
                                    LEXORA-AI
                                </h2>
                            </div>
                        )}
                        {/* Query and Solution Box */}
                        <div className={`relative flex-1 ${lexoraVisible ? 'mt-16' : 'mt-0'} text-white pl-6 pt-6`} style={{ textAlign: "left" }}>
                            {/* Conditional rendering for greeting message */}
                            {greetingVisible ? (
                                <>
                                    <h2 className="text-5xl tracking-tighter font-medium mb-1">
                                        Hello, User
                                    </h2>
                                    <h2 className="text-5xl tracking-tighter font-medium">
                                        How Can I Help You Today?
                                    </h2>
                                </>
                            ) : (
                                <div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-left bg-opacity-50 bg-black rounded-lg overflow-y-auto"
                                    style={{
                                        left: '2%',
                                        width: '1310px',  // Fixed width
                                        height: '400px',  // Fixed height
                                        scrollbarWidth: "thin", // For Firefox
                                        scrollbarColor: "#4a1a74 rgba(255, 255, 255, 0.2)", // Custom scrollbar colors
                                        transform: 'translateY(-67%)',
                                        
                                    }}
                                >
                                    {queriesAndResponses.map((item, index) => (
                                        <div key={index} className="mb-4">
                                            <h2 className="text-lg font-medium text-white">
                                                Query: {item.query}
                                            </h2>
                                            <p className="text-md text-white">
                                                Solution: {item.response}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Chat Input Box */}
                        <div className="absolute bottom-2 w-full p-4 flex items-center" style={{ left: '1%', paddingRight: '40px' }}>
                            <textarea
                                className="w-full h-20 p-3 border rounded-md resize-none"
                                placeholder="Message Lexora..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={{ 
                                    backgroundColor: "rgba(0, 0, 0, 0.4)", // Slightly transparent to blend with background
                                    border: "1px solid rgba(255, 255, 255, 0.2)", 
                                    color: "#fff",
                                    fontSize: "1.25rem" // Increased font sizez
                                    
                                }}
                            />
                            <div className="ml-6"> {/* Increased margin to create space between textarea and button */}
                                <ActionButton
                                    label={"Go"}
                                    onClick={handleClick} // Button click will now handle query display
                                    className="bg-[#4a1a74] text-white border-none px-6 py-3 rounded-md cursor-pointer h-20" // Ensured height consistency with textarea
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
};

export default ChatbotPage;
