
import React from 'react';
import { motion } from 'framer-motion';
import { Video, Play, FileVideo } from 'lucide-react';

const About = () => {
  const skills = [
    { 
      title: "Cinematic Editing", 
      icon: <Play className="w-8 h-8 text-white" />,
      description: "Create compelling narratives with smooth transitions and professional pacing."
    },
    { 
      title: "Color Grading", 
      icon: <FileVideo className="w-8 h-8 text-white" />,
      description: "Enhance visual aesthetics with professional color correction and artistic grading."
    },
    { 
      title: "Motion Graphics", 
      icon: <Video className="w-8 h-8 text-white" />,
      description: "Design dynamic animations and visual effects to elevate your content."
    }
  ];

  return (
    <section id="about" className="py-24 px-6 bg-[#080808] relative">
      {/* Subtle animated gradient */}
      <motion.div 
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 30% 70%, rgba(100, 100, 100, 0.1), transparent 60%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">About Me</h2>
            <p className="text-gray-400 mb-6">
              I'm a professional video editor with over 5 years of experience crafting visual stories for brands, filmmakers, and content creators. My goal is to bring your vision to life through expert editing, color grading, and motion design.
            </p>
            <p className="text-gray-400 mb-6">
              My editing philosophy centers on enhancing the narrative while maintaining the authentic voice of your content. I specialize in creating seamless, engaging edits that captivate viewers and communicate your message effectively.
            </p>
            <p className="text-gray-400">
              When I'm not in the editing room, I'm constantly exploring new techniques, visual styles, and storytelling approaches to bring fresh perspectives to my work.
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <motion.div 
                key={index}
                className="bg-black/40 glass-effect p-6 rounded-xl hover-glow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white/5 p-3 rounded-lg glass-effect">
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-white">{skill.title}</h3>
                    <p className="text-gray-400">{skill.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
