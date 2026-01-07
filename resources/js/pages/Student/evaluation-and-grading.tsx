import React, { useState } from 'react';
import { Users, Calendar, Save, Send, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavFooter } from '@/components/nav-footer';
import AppLayout from '@/layouts/app-layout';
import { AppContent } from '@/components/app-content';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Evaluation & Grading', href: '' },
];

const EvaluationFormSection = () => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: 'save' | 'submit' | null }>({ isOpen: false, type: null });

  const group = {
    code: '3301',
    title: 'Machine Learning Applications in Healthcare Diagnostics'
  };

  const panelists = [
    { id: 1, role: "P1", name: "Dr. Robert Chen", score: 3.8, decision: "Accepted", comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." },
    { id: 2, role: "P2", name: "Dr. Sofia Smith", score: 3.0, decision: "Accepted", comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." },
    { id: 3, role: "P3", name: "Engr. John Johnson", score: 2.2, decision: "Rejected", comments: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." }
  ];

  const rubricSections = [
    {
      id: 1,
      title: "Rubric No. 1 (20%)",
      description: "Conduct investigations of complex engineering problems using research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of information to provide valid conclusions.",
      indicators: [
        { name: "Problem Understanding", desc1: "Demonstrates limited understanding of the problem or lacks awareness of key factors and background.", desc2: "Partially understands the problem but may have gaps in knowledge or limited awareness of key factors and background.", desc3: "Demonstrates a good understanding of problems. Identifies key factors and background.", desc4: "Demonstrates a broad understanding of the problem. Identifies all significant factors and demonstrates exceptional awareness of background." },
        { name: "Research Design", desc1: "Design analysis with inconsistency. Lacks attention to variables and controls.", desc2: "Design analysis with some consistency but with gaps. Includes key variables and controls.", desc3: "Design analysis with clear purpose, correct variables, and controls. Ensures the method is valid and reliable.", desc4: "Design analysis with highly focused purpose, broad consideration of variables and controls. Display exceptional attention to details." },
        { name: "Data Collection and Analysis", desc1: "Collects and analyzes data with limited accuracy. Fails to use appropriate tools or techniques.", desc2: "Collects and analyzes data with some accuracy but with lack of consistency. Uses appropriate tools and techniques.", desc3: "Collects and analyzes data accurately. Uses appropriate tools and techniques effectively.", desc4: "Collects and analyzes data thoroughly, ensuring accuracy. Display exceptional use of advanced tools and techniques." },
      ]
    },
    {
      id: 2,
      title: "Rubric No. 2 (20%)",
      description: "Function effectively as an individual, and as a member or leader in diverse teams and in multidisciplinary settings.",
      indicators: [
        { name: "Individual Contribution", desc1: "Minimal contributions to team activities. Lacks initiative to fulfill responsibility.", desc2: "Some contributions to team activities. Shows limited initiative, need occasional guidance.", desc3: "Significant contributions to team activities. Takes initiative and fulfills individual responsibilities.", desc4: "Exceptional contributions to team activities. Display leadership, initiative and consistencies, fulfill individual responsibilities." },
      ]
    },
    {
      id: 3,
      title: "Rubric No. 3 (20%)",
      description: "Identify, formulate, research literature and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences",
      indicators: [
        { name: "Problem Identification", desc1: "Struggles to identify or define problems. Lacks understanding of problem background.", desc2: "Partially identifies problems but lacks clarity or precision. Shows limited understanding of problem background.", desc3: "Clearly identifies and defines problems. Demonstrates a good understanding of problem background.", desc4: "Skillfully identifies and defines problems. Shows exceptional understanding of problem background." },
        { name: "Problem Formulation", desc1: "Formulates problems with limited specificity or lacks focus. Does not consider relevant variables or constraints.", desc2: "Formulates problems with some specificity but lacks precision or may overlook certain variables or constraints.", desc3: "Formulates problems with clarity and specificity. Considers relevant variables and constraints appropriately.", desc4: "Formulates problems precisely and comprehensively. Identifies and incorporates all relevant variables and constraints." },
        { name: "Research Literature", desc1: "Shows limited ability to research and gather relevant literature.", desc2: "Display some ability to research and gather literature with inconsistency.", desc3: "Research and gather relevant literature effectively. Shows good strength of references.", desc4: "Research and gather comprehensive literature from credible sources. Displays exceptional strength of references." },
      ]
    },
    {
      id: 4,
      title: "Rubric No. 4 (20%)",
      description: "Communicate effectively on complex engineering activities with the engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.",
      indicators: [
        { name: "Technical Content Comprehension", desc1: "Display limited understanding of activities. Struggles to comprehend content or terminology.", desc2: "Shows some understanding of activities but require clarification or explanation of content or terminology.", desc3: "Displays a good understanding of activities. Comprehend content and terminology.", desc4: "Displays exceptional understanding of activities. Comprehend content and terminology with ease and fluency." },
        { name: "Oral Presentation", desc1: "Delivers oral presentation with limited clarity, coherence or effective use of visual aids.", desc2: "Delivers oral presentation with some clarity and coherence. Uses visual aids to some extent.", desc3: "Delivers oral presentation with clarity, coherence and effectiveness. Uses visual aids effectively. Display confidence in public speaking.", desc4: "Delivers presentation with exceptional clarity, coherence, and effectiveness. Uses visual aids creatively and strategically. Display exceptional confidence in speaking engagement." },
        { name: "Documentation", desc1: "Produces written documentation with limited clarity and organization. Lack of effective use of technical term and formatting.", desc2: "Produces written documentation with some clarity and organization. Uses technical term and appropriate formatting to a certain extent.", desc3: "Produces written documentation with clarity, organization and coherence. Uses technical language and appropriate formatting effectively.", desc4: "Produces written documentation with exceptional clarity, organization and coherence. Uses technical term and appropriate formatting with precision." },
      ]
    },
    {
      id: 5,
      title: "Rubric No. 5 (20%)",
      description: "Engage in life-long learning and understand the need to keep current of the development in the specific field of practice.",
      indicators: [
        { name: "Technological Change Awareness", desc1: "Display limited awareness of implication of technological change. Needs understanding of emerging technologies.", desc2: "Shows some awareness of technological change but not consistently keep up.", desc3: "Displays a good awareness of technological change and keeps up with emerging technologies.", desc4: "Demonstrates exceptional awareness of technological change. Proactively explores and integrates emerging technologies." },
        { name: "Independent Learning Preparation", desc1: "Needs preparation and planning for independent learning. May strive to identify learning needs.", desc2: "Displays some preparation and planning for independent learning but not consistently identify learning needs.", desc3: "Displays effective preparation and planning for independent learning. Identifies learning needs and relevant learning goals.", desc4: "Demonstrates exceptional preparation for independent learning with highly focused planning and comprehensive identification of learning needs." },
        { name: "Learning Strategies", desc1: "Needs awareness of effective learning strategies. Does not utilize strategies to enhance learning or address challenges.", desc2: "Displays some awareness of learning strategies but not consistently use them effectively or adapt to different learning contexts.", desc3: "Applies effective learning strategies to enhance learning and address challenges. Displays flexibility in adapting strategies to different learning contexts.", desc4: "Applies a wide range of effective learning strategies with consistency and adaptability. Displays exceptional self-aware skills in selecting and adjusting strategies based on learning objectives and contexts." },
        { name: "Resource Utilization", desc1: "Does not effectively utilize available resources for learning. Needs awareness of relevant resources.", desc2: "Utilizes some resources for learning but not fully maximize their potential. Obtain relevant resources.", desc3: "Effectively identifies and utilizes available resources for learning. Shows good creativity and seeks out additional resources.", desc4: "Displays exceptional ability to identify and utilize a wide range of resources effectively. Shows creativity in seeking out and critically evaluating new resources." },
        { name: "Continuous Improvement", desc1: "Shows resistance to feedback and limited willingness to make improvements. Does not take proactive steps to enhance skills or knowledge.", desc2: "Displays some openness to feedback and makes occasional upgrades. Takes limited initiative in enhancing skills or knowledge.", desc3: "Shows openness to feedback and actively seeks opportunities for improvement. Takes initiative in enhancing skills or knowledge based on feedback and self-reflection.", desc4: "Embraces feedback with enthusiasm and actively seeks continuous improvement opportunities. Takes proactive and deliberate measures to enhance skills, knowledge, and professional development." },
      ]
    }
  ];

  const handleRatingChange = (sectionId: number, indicatorIndex: number, value: number) => {
    setRatings(prev => ({ ...prev, [`${sectionId}-${indicatorIndex}`]: value }));
  };

  const handleConfirmAction = () => {
    if (modalConfig.type === 'save') {
      console.log("Saving Draft...");
    } else if (modalConfig.type === 'submit') {
      console.log("Submitting Grades...");
    }
    setModalConfig({ isOpen: false, type: null });
  };

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <AppContent
          variant="header"
          title="Evaluation & Grading"
          subtitle="Complete thesis defense evaluation form"
          icon={
            <div className="flex h-8 w-8 items-center justify-center text-primary">
              <ClipboardCheck className="h-8 w-8" />
            </div>
          }
        >
          {/* Confirmation Modal */}
          {modalConfig.isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-[#900000] rounded-full flex items-center justify-center mb-6 shadow-md">
                  <span className="text-white text-4xl font-bold">!</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Are you sure you want to {modalConfig.type === 'save' ? 'save changes' : 'submit grades'}?
                </h2>
                <p className="text-gray-900 font-medium text-sm mb-8">
                  This action cannot be undone.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button variant="link"
                    onClick={() => setModalConfig({ isOpen: false, type: null })}
                    className="px-10 py-2.5 rounded-full border border-gray-800 text-gray-900 font-bold hover:bg-gray-50 transition-colors min-w-[120px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmAction}
                    className="px-10 py-2.5 rounded-full bg-[#900000] text-white font-bold hover:bg-[#700000] transition-colors shadow-sm min-w-[120px]"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-1 flex-col gap-6 w-full">
            <div className="space-y-6">
              
              {/* Header */}
              <h2 className="text-[#900000] text-lg font-bold mb-6">
                Individual Evaluation
              </h2>

              {/* Defense Details Card */}
              <div className="bg-[#FDFCF6] border border-stone-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[#900000] font-bold text-lg">Defense Details</h2>
                    <p className="text-gray-500 text-xs mt-1">Complete information about the thesis defense</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-primary mb-1 block">Defense ID</span>
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold text-gray-800">DEF-{group.code}</span>
                      <span className="bg-green-700 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-[#900000] text-xs font-bold mb-1">Thesis Title</h3>
                  <p className="font-bold text-gray-800 text-sm">{group.title}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 grid grid-cols-3 gap-y-6 gap-x-4">
                    <div className="col-span-1">
                      <h3 className="text-[#900000] text-xs font-bold">Block</h3>
                      <span className="text-gray-600 text-xs mt-1 inline-block bg-stone-100 px-2 py-0.5 rounded border border-stone-200">BSCPE 3-3</span>
                    </div>
                    <div className="col-span-1">
                      <h3 className="text-[#900000] text-xs font-bold">Venue</h3>
                      <p className="text-gray-600 text-xs mt-1">Room 313, CEA</p>
                    </div>
                    <div className="col-span-1">
                      <h3 className="text-[#900000] text-xs font-bold">Time</h3>
                      <p className="text-gray-600 text-xs mt-1">09:00 AM</p>
                    </div>
                    <div className="col-span-1">
                      <h3 className="text-[#900000] text-xs font-bold">Thesis Adviser</h3>
                      <p className="text-gray-600 text-xs mt-1">Dr. Maria Santos</p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-[#900000] text-xs font-bold">Date</h3>
                      <p className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> 11/25/2025
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-[#900000] text-xs font-bold">Proponents</h3>
                    <div className="flex flex-col gap-2 mt-1">
                      {['John Doe', 'Jane Smith', 'Mike Johnson', 'John Doe'].map((name, i) => (
                        <span key={i} className="bg-[#F5ECD5] text-[#700000] text-[10px] px-2 py-1 rounded-full font-bold w-fit flex items-center gap-1">
                          <Users className="w-3 h-3" /> {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <h3 className="text-[#900000] text-xs font-bold">Defense Panel</h3>
                    <div className="flex flex-col gap-3 mt-2">
                      {panelists.map((panelist) => (
                        <div key={panelist.id} className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-stone-100 shadow-sm">
                          <span className="bg-[#BC8585] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">
                            {panelist.role}
                          </span>
                          <span className="text-gray-800 text-xs font-bold">{panelist.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Panelist Evaluation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                {panelists.map((panelist) => (
                  <div key={panelist.id} className="bg-[#FDFCF6] border border-stone-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                      <div className="w-8 h-8 rounded-full bg-[#BC8585] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {panelist.role}
                      </div>
                      <span className="font-bold text-gray-800 text-sm">{panelist.name}</span>
                    </div>

                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-[#900000] text-xs font-bold mb-1">Total Score</h4>
                        <span className="text-lg font-bold text-gray-800">{panelist.score}</span>
                      </div>
                      <div className="text-right">
                        <h4 className="text-[#900000] text-xs font-bold mb-1">Evaluation Decision</h4>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-bold text-white shadow-sm ${
                          panelist.decision === 'Accepted' ? 'bg-evaluated-font-color' : 'bg-primary'
                        }`}>
                          {panelist.decision}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#900000] text-xs font-bold mb-2">Comments/Recommendations</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {panelist.comments}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rubrics Section */}
              <div className="bg-[#FDFCF6] border border-stone-200 rounded-xl p-8 shadow-sm mt-10">
                {rubricSections.map((rubric, idx) => (
                  <div key={rubric.id} className="space-y-4">
                    {idx > 0 && <div className="w-full h-px bg-black my-10" />}

                    <div className="mb-2">
                      <h3 className="text-primary font-bold text-md">{rubric.title}</h3>
                      <p className="text-xs font-bold max-w-4xl leading-relaxed">{rubric.description}</p>
                    </div>

                    <div className="border border-[#D4A3A3] rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-center text-xs">
                            <th className="px-4 py-3 w-[20%] text-left font-bold bg-[#700000] text-white">
                              Performance Indicator
                            </th>
                            <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold border-r border-[#E0D0A0]">
                              1<br/>Insufficient
                            </th>
                            <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold border-r border-[#E0D0A0]">
                              2<br/>Developing
                            </th>
                            <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold border-r border-[#E0D0A0]">
                              3<br/>Proficient
                            </th>
                            <th className="px-4 py-3 w-[18%] bg-[#F5ECD5] text-[#520000] font-bold">
                              4<br/>Advanced
                            </th>
                            <th className="px-2 py-3 w-[8%] bg-[#E5E5E5] text-gray-700 font-bold border-l border-gray-300">
                              Rating
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-xs">
                          {rubric.indicators.map((indicator, i) => (
                            <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-red-50/20 transition-colors">
                              <td className="px-4 py-4 font-bold text-gray-800 border-r border-gray-100 bg-white align-middle">
                                {indicator.name}
                              </td>
                              {[indicator.desc1, indicator.desc2, indicator.desc3, indicator.desc4].map((desc, ratingIdx) => (
                                <td key={ratingIdx} className="px-4 py-4 text-gray-600 border-r border-gray-100 bg-white align-top">
                                  <span className="leading-snug">{desc}</span>
                                </td>
                              ))}
                              <td className="px-2 py-4 bg-gray-50 text-center border-l border-gray-200 align-middle">
                                <div className="flex justify-center gap-2">
                                  {[1, 2, 3, 4].map((val) => (
                                    <div key={val} className="flex flex-col items-center">
                                      <span className="text-[9px] font-bold text-gray-400 mb-1">{val}</span>
                                      <input 
                                        type="radio" 
                                        name={`rating-${rubric.id}-${i}`}
                                        checked={ratings[`${rubric.id}-${i}`] === val}
                                        onChange={() => handleRatingChange(rubric.id, i, val)}
                                        className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-[#900000] checked:border-[6px] transition-all cursor-pointer bg-white"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-200 my-8" />
              
              {/* Total Score and Decision Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FDFCF6] border border-[#D4A3A3] rounded-xl p-6 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-[#900000] font-bold text-sm mb-1">Total Score</span>
                  <span className="text-4xl font-bold text-gray-800">3.0</span>
                </div>
                <div className="bg-[#FDFCF6] border border-[#D4A3A3] rounded-xl p-6 shadow-sm md:col-span-2">
                  <h3 className="text-[#900000] font-bold text-sm mb-4">Evaluation Decision</h3>
                  <div className="flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="decision" 
                        defaultChecked
                        className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#900000] checked:border-[6px] transition-all" 
                      />
                      <span className="font-bold text-gray-700 group-hover:text-[#900000] transition-colors">Accepted</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="decision" 
                        className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#900000] checked:border-[6px] transition-all" 
                      />
                      <span className="font-bold text-gray-700 group-hover:text-[#900000] transition-colors">Rejected</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 pb-8">
                <Button
                  onClick={() => setModalConfig({ isOpen: true, type: 'save' })}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#730000] text-white text-sm font-bold hover:bg-[#850000] shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" /> Save as Draft
                </Button>
                <Button 
                  onClick={() => setModalConfig({ isOpen: true, type: 'submit' })}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#520000] text-white text-sm font-bold hover:bg-[#3d0000] shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" /> Submit Grades
                </Button>
              </div>

            </div>
          </div>
        </AppContent>
      </AppLayout>
      
      {/* Nav Footer */}
      <NavFooter/>
    </>
  );
};

export default EvaluationFormSection;
