import { EvaluationRow, ResultRow } from './awards_utils';

export const evaluationData: EvaluationRow[] = [
    { 
        groupCode: '4101', 
        title: 'Machine Learning in Healthcare Diagnostics', 
        criteria1: 'Graded', 
        criteria2: 'Graded', 
        criteria3: 'Graded', 
        status: 'Complete', 
        count: '3/3',
        proponents: ['Rona Dela Cruz', 'Jane Reyes', 'Jane Santos', 'Jane Ramos'],
        adviser: 'Dr. Robert Dela Cruz'
    },
    { 
        groupCode: '4102', 
        title: 'AI-Powered Smart Home Security System', 
        criteria1: 'Graded', 
        criteria2: 'Graded', 
        criteria3: 'Graded', 
        status: 'Complete', 
        count: '3/3',
        proponents: ['John Smith', 'Maria Garcia', 'Peter Lee', 'Sarah Johnson'],
        adviser: 'Dr. Emily Chen'
    },
    { 
        groupCode: '4201', 
        title: 'Blockchain-Based Supply Chain Management', 
        criteria1: 'Graded', 
        criteria2: 'Graded', 
        criteria3: 'Graded', 
        status: 'Complete', 
        count: '3/3',
        proponents: ['Alex Wong', 'Diana Prince', 'Bruce Wayne', 'Clark Kent'],
        adviser: 'Dr. James Wilson'
    },
    { 
        groupCode: '4202', 
        title: 'IoT Agricultural Monitoring System', 
        criteria1: 'Graded', 
        criteria2: 'Graded', 
        criteria3: 'No Grades Yet', 
        status: 'In Progress', 
        count: '2/3',
        proponents: ['Tom Holland', 'Zendaya Coleman', 'Jacob Batalon', 'Laura Harrier'],
        adviser: 'Dr. Anna Martinez'
    },
    { 
        groupCode: '4301', 
        title: 'Natural Language Processing Chatbot', 
        criteria1: 'Graded', 
        criteria2: 'No Grades Yet', 
        criteria3: 'No Grades Yet', 
        status: 'In Progress', 
        count: '1/3',
        proponents: ['Chris Evans', 'Scarlett Johansson', 'Robert Downey', 'Mark Ruffalo'],
        adviser: 'Dr. Steven Rogers'
    },
    { 
        groupCode: '4302', 
        title: 'Computer Vision Traffic Analysis', 
        criteria1: 'No Grades Yet', 
        criteria2: 'No Grades Yet', 
        criteria3: 'Graded', 
        status: 'In Progress', 
        count: '1/3',
        proponents: ['Benedict Cumberbatch', 'Tom Hiddleston', 'Paul Bettany', 'Elizabeth Olsen'],
        adviser: 'Dr. Stephen Strange'
    },
    { 
        groupCode: '4404', 
        title: 'Mobile Health Monitoring Application', 
        criteria1: 'No Grades Yet', 
        criteria2: 'No Grades Yet', 
        criteria3: 'No Grades Yet', 
        status: 'Not Yet Started', 
        count: '0/3',
        proponents: ['Chris Hemsworth', 'Natalie Portman', 'Tessa Thompson', 'Taika Waititi'],
        adviser: 'Dr. Jane Foster'
    },
    { 
        groupCode: '4405', 
        title: 'Renewable Energy Management System', 
        criteria1: 'No Grades Yet', 
        criteria2: 'No Grades Yet', 
        criteria3: 'No Grades Yet', 
        status: 'Not Yet Started', 
        count: '0/3',
        proponents: ['Chadwick Boseman', 'Lupita Nyongo', 'Danai Gurira', 'Letitia Wright'],
        adviser: 'Dr. TChalla Udaku'
    },
    { 
        groupCode: '4501', 
        title: 'E-Learning Platform with Analytics', 
        criteria1: 'No Grades Yet', 
        criteria2: 'No Grades Yet', 
        criteria3: 'No Grades Yet', 
        status: 'Not Yet Started', 
        count: '0/3',
        proponents: ['Brie Larson', 'Samuel Jackson', 'Ben Mendelsohn', 'Lashana Lynch'],
        adviser: 'Dr. Carol Danvers'
    },
    { 
        groupCode: '4602', 
        title: 'Smart Waste Management System', 
        criteria1: 'No Grades Yet', 
        criteria2: 'No Grades Yet', 
        criteria3: 'No Grades Yet', 
        status: 'Not Yet Started', 
        count: '0/3',
        proponents: ['Paul Rudd', 'Evangeline Lilly', 'Michael Douglas', 'Michelle Pfeiffer'],
        adviser: 'Dr. Hank Pym'
    },
];

export const resultsData: ResultRow[] = [
    { rank: 1, groupCode: '4101', title: 'Machine Learning in Healthcare Diagnostics', criteria1: 38, criteria2: 32, criteria3: 25, totalScore: 95, isComplete: true },
    { rank: 2, groupCode: '4102', title: 'AI-Powered Smart Home Security System', criteria1: 36, criteria2: 31, criteria3: 23, totalScore: 90, isComplete: true },
    { rank: 3, groupCode: '4201', title: 'Blockchain-Based Supply Chain Management', criteria1: 35, criteria2: 32, criteria3: 22, totalScore: 89, isComplete: true },
    { rank: 4, groupCode: '4202', title: 'IoT Agricultural Monitoring System', criteria1: 34, criteria2: 30, criteria3: null, totalScore: null, isComplete: false },
    { rank: 5, groupCode: '4301', title: 'Natural Language Processing Chatbot', criteria1: 34, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
    { rank: 6, groupCode: '4302', title: 'Computer Vision Traffic Analysis', criteria1: null, criteria2: null, criteria3: 21, totalScore: null, isComplete: false },
    { rank: 7, groupCode: '4404', title: 'Mobile Health Monitoring Application', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
    { rank: 8, groupCode: '4405', title: 'Renewable Energy Management System', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
    { rank: 9, groupCode: '4501', title: 'E-Learning Platform with Analytics', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
    { rank: 10, groupCode: '4602', title: 'Smart Waste Management System', criteria1: null, criteria2: null, criteria3: null, totalScore: null, isComplete: false },
];

// Sample evaluation results data for the View Results Modal
export const detailedEvaluationResults = {
    '4101': {
        groupCode: '4101',
        title: 'Machine Learning in Healthcare Diagnostics',
        proponents: ['Rona Dela Cruz', 'Jane Reyes', 'Jane Santos', 'Jane Ramos'],
        adviser: 'Dr. Robert Dela Cruz',
        criteria1Results: [
            { criterion: 'The output of the group is complete in accordance with the specified requirements.', score: 20, maxScore: 20 },
            { criterion: 'The output of the group is correct in accordance with the theories and concept of the topic category.', score: 18, maxScore: 20 },
        ],
        criteria2Results: [
            { criterion: 'The student was responsible for authoring at least 1/n (where n is the number of member in a group) of the content of the Project Proposal Documentation.', score: 10, maxScore: 10 },
            { criterion: 'The student contributed significant ideas for discussion.', score: 10, maxScore: 10 },
            { criterion: 'The student correctly answered the question given by the panelist.', score: 9, maxScore: 10 },
            { criterion: 'The student contributed to the development of visual aids and exhibited preparedness in presenting the topic assigned for discussion.', score: 5, maxScore: 5 },
        ],
        criteria3Results: [
            { criterion: 'Originality/novelty/usefulness, innovation/adaptation/patentability.', score: 4, maxScore: 5 },
            { criterion: 'Potential for local value-added.', score: 4, maxScore: 5 },
            { criterion: 'Commercialization Scale / Profitability and Productivity.', score: 5, maxScore: 5 },
            { criterion: 'Use of environment-friendly materials/technology.', score: 5, maxScore: 5 },
            { criterion: 'Benefits to the public.', score: 5, maxScore: 5 },
        ],
        criteria1Total: 38,
        criteria2Total: 34,
        criteria3Total: 23,
        comments: [
            {
                evaluator: 'Dr. Robert Dela Cruz',
                timestamp: '2025-12-01 02:15 PM',
                comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac eros quam. Vestibulum ante nulla, lacinia et tempor eget, rutrum non purus. Aliquam erat volutpat.'
            },
            {
                evaluator: 'Dr. Robert Dela Cruz',
                timestamp: '2025-12-01 02:15 PM',
                comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac eros quam. Vestibulum ante nulla, lacinia et tempor eget, rutrum non purus. Aliquam erat volutpat.'
            },
            {
                evaluator: 'Dr. Robert Dela Cruz',
                timestamp: '2025-12-01 02:15 PM',
                comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac eros quam. Vestibulum ante nulla, lacinia et tempor eget, rutrum non purus. Aliquam erat volutpat.'
            },
        ]
    },
    '4102': {
        groupCode: '4102',
        title: 'AI-Powered Smart Home Security System',
        proponents: ['John Smith', 'Maria Garcia', 'Peter Lee', 'Sarah Johnson'],
        adviser: 'Dr. Emily Chen',
        criteria1Results: [
            { criterion: 'The output of the group is complete in accordance with the specified requirements.', score: 19, maxScore: 20 },
            { criterion: 'The output of the group is correct in accordance with the theories and concept of the topic category.', score: 17, maxScore: 20 },
        ],
        criteria2Results: [
            { criterion: 'The student was responsible for authoring at least 1/n (where n is the number of member in a group) of the content of the Project Proposal Documentation.', score: 10, maxScore: 10 },
            { criterion: 'The student contributed significant ideas for discussion.', score: 9, maxScore: 10 },
            { criterion: 'The student correctly answered the question given by the panelist.', score: 8, maxScore: 10 },
            { criterion: 'The student contributed to the development of visual aids and exhibited preparedness in presenting the topic assigned for discussion.', score: 4, maxScore: 5 },
        ],
        criteria3Results: [
            { criterion: 'Originality/novelty/usefulness, innovation/adaptation/patentability.', score: 5, maxScore: 5 },
            { criterion: 'Potential for local value-added.', score: 4, maxScore: 5 },
            { criterion: 'Commercialization Scale / Profitability and Productivity.', score: 5, maxScore: 5 },
            { criterion: 'Use of environment-friendly materials/technology.', score: 4, maxScore: 5 },
            { criterion: 'Benefits to the public.', score: 5, maxScore: 5 },
        ],
        criteria1Total: 36,
        criteria2Total: 31,
        criteria3Total: 23,
        comments: [
            {
                evaluator: 'Dr. Emily Chen',
                timestamp: '2025-12-02 10:30 AM',
                comment: 'Excellent work on the security system implementation. The AI integration is well-thought-out and practical.'
            },
        ]
    },
    '4201': {
        groupCode: '4201',
        title: 'Blockchain-Based Supply Chain Management',
        proponents: ['Alex Wong', 'Diana Prince', 'Bruce Wayne', 'Clark Kent'],
        adviser: 'Dr. James Wilson',
        criteria1Results: [
            { criterion: 'The output of the group is complete in accordance with the specified requirements.', score: 18, maxScore: 20 },
            { criterion: 'The output of the group is correct in accordance with the theories and concept of the topic category.', score: 17, maxScore: 20 },
        ],
        criteria2Results: [
            { criterion: 'The student was responsible for authoring at least 1/n (where n is the number of member in a group) of the content of the Project Proposal Documentation.', score: 10, maxScore: 10 },
            { criterion: 'The student contributed significant ideas for discussion.', score: 10, maxScore: 10 },
            { criterion: 'The student correctly answered the question given by the panelist.', score: 8, maxScore: 10 },
            { criterion: 'The student contributed to the development of visual aids and exhibited preparedness in presenting the topic assigned for discussion.', score: 4, maxScore: 5 },
        ],
        criteria3Results: [
            { criterion: 'Originality/novelty/usefulness, innovation/adaptation/patentability.', score: 4, maxScore: 5 },
            { criterion: 'Potential for local value-added.', score: 4, maxScore: 5 },
            { criterion: 'Commercialization Scale / Profitability and Productivity.', score: 5, maxScore: 5 },
            { criterion: 'Use of environment-friendly materials/technology.', score: 4, maxScore: 5 },
            { criterion: 'Benefits to the public.', score: 5, maxScore: 5 },
        ],
        criteria1Total: 35,
        criteria2Total: 32,
        criteria3Total: 22,
        comments: [
            {
                evaluator: 'Dr. James Wilson',
                timestamp: '2025-12-03 03:45 PM',
                comment: 'Strong blockchain implementation with good understanding of supply chain logistics. Consider exploring more real-world applications.'
            },
            {
                evaluator: 'Dr. James Wilson',
                timestamp: '2025-12-03 03:50 PM',
                comment: 'The team showed excellent collaboration and technical depth during the defense.'
            },
        ]
    },
    '4202': {
        groupCode: '4202',
        title: 'IoT Agricultural Monitoring System',
        proponents: ['Tom Holland', 'Zendaya Coleman', 'Jacob Batalon', 'Laura Harrier'],
        adviser: 'Dr. Anna Martinez',
        criteria1Results: [
            { criterion: 'The output of the group is complete in accordance with the specified requirements.', score: 18, maxScore: 20 },
            { criterion: 'The output of the group is correct in accordance with the theories and concept of the topic category.', score: 16, maxScore: 20 },
        ],
        criteria2Results: [
            { criterion: 'The student was responsible for authoring at least 1/n (where n is the number of member in a group) of the content of the Project Proposal Documentation.', score: 10, maxScore: 10 },
            { criterion: 'The student contributed significant ideas for discussion.', score: 9, maxScore: 10 },
            { criterion: 'The student correctly answered the question given by the panelist.', score: 7, maxScore: 10 },
            { criterion: 'The student contributed to the development of visual aids and exhibited preparedness in presenting the topic assigned for discussion.', score: 4, maxScore: 5 },
        ],
        criteria3Results: [], // No grades yet for Criteria 3
        criteria1Total: 34,
        criteria2Total: 30,
        criteria3Total: null,
    },
    '4301': {
        groupCode: '4301',
        title: 'Natural Language Processing Chatbot',
        proponents: ['Chris Evans', 'Scarlett Johansson', 'Robert Downey', 'Mark Ruffalo'],
        adviser: 'Dr. Steven Rogers',
        criteria1Results: [
            { criterion: 'The output of the group is complete in accordance with the specified requirements.', score: 18, maxScore: 20 },
            { criterion: 'The output of the group is correct in accordance with the theories and concept of the topic category.', score: 16, maxScore: 20 },
        ],
        criteria2Results: [], // No grades yet for Criteria 2
        criteria3Results: [], // No grades yet for Criteria 3
        criteria1Total: 34,
        criteria2Total: null,
        criteria3Total: null,
    },
    '4302': {
        groupCode: '4302',
        title: 'Computer Vision Traffic Analysis',
        proponents: ['Benedict Cumberbatch', 'Tom Hiddleston', 'Paul Bettany', 'Elizabeth Olsen'],
        adviser: 'Dr. Stephen Strange',
        criteria1Results: [], // No grades yet for Criteria 1
        criteria2Results: [], // No grades yet for Criteria 2
        criteria3Results: [
            { criterion: 'Originality/novelty/usefulness, innovation/adaptation/patentability.', score: 4, maxScore: 5 },
            { criterion: 'Potential for local value-added.', score: 4, maxScore: 5 },
            { criterion: 'Commercialization Scale / Profitability and Productivity.', score: 5, maxScore: 5 },
            { criterion: 'Use of environment-friendly materials/technology.', score: 3, maxScore: 5 },
            { criterion: 'Benefits to the public.', score: 5, maxScore: 5 },
        ],
        criteria1Total: null,
        criteria2Total: null,
        criteria3Total: 21,
    },
    '4404': {
        groupCode: '4404',
        title: 'Mobile Health Monitoring Application',
        proponents: ['Chris Hemsworth', 'Natalie Portman', 'Tessa Thompson', 'Taika Waititi'],
        adviser: 'Dr. Jane Foster',
        criteria1Results: [], // No grades yet
        criteria2Results: [], // No grades yet
        criteria3Results: [], // No grades yet
        criteria1Total: null,
        criteria2Total: null,
        criteria3Total: null,
    },
    '4405': {
        groupCode: '4405',
        title: 'Renewable Energy Management System',
        proponents: ['Chadwick Boseman', 'Lupita Nyongo', 'Danai Gurira', 'Letitia Wright'],
        adviser: 'Dr. TChalla Udaku',
        criteria1Results: [],
        criteria2Results: [],
        criteria3Results: [],
        criteria1Total: null,
        criteria2Total: null,
        criteria3Total: null,
    },
    '4501': {
        groupCode: '4501',
        title: 'E-Learning Platform with Analytics',
        proponents: ['Brie Larson', 'Samuel Jackson', 'Ben Mendelsohn', 'Lashana Lynch'],
        adviser: 'Dr. Carol Danvers',
        criteria1Results: [],
        criteria2Results: [],
        criteria3Results: [],
        criteria1Total: null,
        criteria2Total: null,
        criteria3Total: null,
    },
    '4602': {
        groupCode: '4602',
        title: 'Smart Waste Management System',
        proponents: ['Paul Rudd', 'Evangeline Lilly', 'Michael Douglas', 'Michelle Pfeiffer'],
        adviser: 'Dr. Hank Pym',
        criteria1Results: [],
        criteria2Results: [],
        criteria3Results: [],
        criteria1Total: null,
        criteria2Total: null,
        criteria3Total: null,
    },
};