import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export const seedQuizzes = () => {
  const quizzesData = [
    {
      level: 1,
      title_en: 'Introduction to Cells',
      title_sv: 'Introduktion till celler',
      description_en: 'Basic cellular anatomy.',
      description_sv: 'Grundläggande cellanatomi.',
      category: 'General',
      questions: [
        { q_en: 'What is the powerhouse of the cell?', q_sv: 'Vad är cellens kraftverk?', options_en: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], options_sv: ['Cellkärna', 'Mitokondrie', 'Ribosom', 'Golgiapparaten'], ans_en: 'Mitochondria', ans_sv: 'Mitokondrie', expl_en: 'Mitochondria produce energy (ATP) for the cell.', expl_sv: 'Mitokondrier producerar energi (ATP) för cellen.' },
        { q_en: 'Which part of the cell contains genetic material?', q_sv: 'Vilken del av cellen innehåller genetiskt material?', options_en: ['Cytoplasm', 'Cell membrane', 'Nucleus', 'Vacuole'], options_sv: ['Cytoplasma', 'Cellmembran', 'Cellkärna', 'Vakuol'], ans_en: 'Nucleus', ans_sv: 'Cellkärna', expl_en: 'The nucleus houses DNA.', expl_sv: 'Cellkärnan innehåller DNA.' },
        { q_en: 'What is the outer boundary of an animal cell?', q_sv: 'Vad är den yttre gränsen för en djurcell?', options_en: ['Cell wall', 'Cell membrane', 'Nuclear envelope', 'Capsid'], options_sv: ['Cellvägg', 'Cellmembran', 'Kärnmembran', 'Kapsid'], ans_en: 'Cell membrane', ans_sv: 'Cellmembran', expl_en: 'The cell membrane regulates what enters and leaves the cell.', expl_sv: 'Cellmembranet reglerar vad som kommer in i och lämnar cellen.' },
        { q_en: 'What is the largest organ in the human body?', q_sv: 'Vilket är det största organet i människokroppen?', options_en: ['Heart', 'Liver', 'Skin', 'Lungs'], options_sv: ['Hjärta', 'Lever', 'Hud', 'Lungor'], ans_en: 'Skin', ans_sv: 'Hud', expl_en: 'The skin is the largest organ by surface area.', expl_sv: 'Huden är det största organet sett till yta.' },
        { q_en: 'How many systems are typically recognized in the human body?', q_sv: 'Hur många system brukar man dela in människokroppen i?', options_en: ['5', '8', '11', '15'], options_sv: ['5', '8', '11', '15'], ans_en: '11', ans_sv: '11', expl_en: 'There are 11 major organ systems.', expl_sv: 'Det finns 11 stora organsystem.' }
      ]
    },
    {
      level: 2,
      title_en: 'Basic Osteology',
      title_sv: 'Grundläggande osteologi',
      description_en: 'Fundamentals of the skeletal system.',
      description_sv: 'Grunderna i skelettsystemet.',
      category: 'Skeletal',
      questions: [
        { q_en: 'How many bones are in the adult human body?', q_sv: 'Hur många ben finns det i den vuxna människokroppen?', options_en: ['206', '300', '180', '250'], options_sv: ['206', '300', '180', '250'], ans_en: '206', ans_sv: '206', expl_en: 'Adults have 206 bones.', expl_sv: 'Vuxna har 206 ben.' },
        { q_en: 'What is the longest bone in the human body?', q_sv: 'Vilket är det längsta benet i människokroppen?', options_en: ['Humerus', 'Tibia', 'Femur', 'Fibula'], options_sv: ['Humerus', 'Tibia', 'Femur', 'Fibula'], ans_en: 'Femur', ans_sv: 'Femur', expl_en: 'The femur (thigh bone) is the longest.', expl_sv: 'Femur (lårbenet) är det längsta benet.' },
        { q_en: 'Which bone protects the brain?', q_sv: 'Vilket ben skyddar hjärnan?', options_en: ['Ribs', 'Skull', 'Pelvis', 'Sternum'], options_sv: ['Revben', 'Kranium', 'Bäcken', 'Bröstben'], ans_en: 'Skull', ans_sv: 'Kranium', expl_en: 'The skull or cranium protects the brain.', expl_sv: 'Kraniet skyddar hjärnan.' },
        { q_en: 'What are the building blocks of bones?', q_sv: 'Vad är skelettets byggstenar?', options_en: ['Calcium and Phosphorus', 'Iron and Zinc', 'Potassium', 'Sodium'], options_sv: ['Kalcium och fosfor', 'Järn och zink', 'Kalium', 'Natrium'], ans_en: 'Calcium and Phosphorus', ans_sv: 'Kalcium och fosfor', expl_en: 'Bones are primarily made of calcium phosphate.', expl_sv: 'Ben består främst av kalciumfosfat.' },
        { q_en: 'Where is the smallest bone in the body located?', q_sv: 'Var finns kroppens minsta ben?', options_en: ['Hand', 'Foot', 'Ear', 'Nose'], options_sv: ['Handen', 'Foten', 'Örat', 'Näsan'], ans_en: 'Ear', ans_sv: 'Örat', expl_en: 'The stapes in the middle ear is the smallest bone.', expl_sv: 'Stigbygeln i mellanörat är det minsta benet.' }
      ]
    },
    {
      level: 3,
      title_en: 'Major Muscles',
      title_sv: 'Stora muskler',
      description_en: 'Introduction to the muscular system.',
      description_sv: 'Introduktion till muskelsystemet.',
      category: 'Muscular',
      questions: [
        { q_en: 'Which muscle is known as the "calf muscle"?', q_sv: 'Vilken muskel är känd som "vadmuskeln"?', options_en: ['Biceps', 'Gastrocnemius', 'Triceps', 'Quadriceps'], options_sv: ['Biceps', 'Gastrocnemius', 'Triceps', 'Quadriceps'], ans_en: 'Gastrocnemius', ans_sv: 'Gastrocnemius', expl_en: 'The gastrocnemius is the large muscle at the back of the lower leg.', expl_sv: 'Gastrocnemius är den stora muskeln på baksidan av underbenet.' },
        { q_en: 'What type of muscle is the heart?', q_sv: 'Vilken typ av muskel är hjärtat?', options_en: ['Skeletal', 'Smooth', 'Cardiac', 'Voluntary'], options_sv: ['Skelettmuskel', 'Glatt muskel', 'Hjärtmuskel', 'Viljestyrd'], ans_en: 'Cardiac', ans_sv: 'Hjärtmuskel', expl_en: 'The heart consists of specialized cardiac muscle.', expl_sv: 'Hjärtat består av specialiserad hjärtmuskulatur.' },
        { q_en: 'Which muscle allows you to flex your elbow?', q_sv: 'Vilken muskel gör att du kan böja armbågen?', options_en: ['Triceps', 'Deltoid', 'Biceps brachii', 'Trapezius'], options_sv: ['Triceps', 'Deltoideus', 'Biceps brachii', 'Trapezius'], ans_en: 'Biceps brachii', ans_sv: 'Biceps brachii', expl_en: 'The biceps brachii flexes the forearm.', expl_sv: 'Biceps brachii böjer underarmen.' },
        { q_en: 'What is the largest muscle in the human body?', q_sv: 'Vilken är den största muskeln i människokroppen?', options_en: ['Latissimus dorsi', 'Gluteus maximus', 'Sartorius', 'Pectoralis major'], options_sv: ['Latissimus dorsi', 'Gluteus maximus', 'Sartorius', 'Pectoralis major'], ans_en: 'Gluteus maximus', ans_sv: 'Gluteus maximus', expl_en: 'The gluteus maximus (buttock muscle) is the largest.', expl_sv: 'Gluteus maximus (sätesmuskeln) är den största.' },
        { q_en: 'Muscles are attached to bones by what?', q_sv: 'Muskler fäster vid ben med hjälp av vad?', options_en: ['Ligaments', 'Tendons', 'Cartilage', 'Nerves'], options_sv: ['Ligament', 'Senor', 'Brosk', 'Nerver'], ans_en: 'Tendons', ans_sv: 'Senor', expl_en: 'Tendons connect muscle to bone.', expl_sv: 'Senor kopplar ihop muskel med ben.' }
      ]
    },
    {
        level: 4,
        title_en: 'Organ Systems',
        title_sv: 'Organsystem',
        description_en: 'Overview of how organs work together.',
        description_sv: 'Översikt över hur organ samverkar.',
        category: 'General',
        questions: [
          { q_en: 'Which system is responsible for transporting oxygen?', q_sv: 'Vilket system ansvarar för att transportera syre?', options_en: ['Digestive', 'Circulatory', 'Nervous', 'Urinary'], options_sv: ['Matsmältningssystemet', 'Cirkulationssystemet', 'Nervsystemet', 'Urinvägssystemet'], ans_en: 'Circulatory', ans_sv: 'Cirkulationssystemet', expl_en: 'The circulatory system moves blood and oxygen.', expl_sv: 'Cirkulationssystemet transporterar blod och syre.' },
          { q_en: 'Which organ belongs to the digestive system?', q_sv: 'Vilket organ tillhör matsmältningssystemet?', options_en: ['Kidney', 'Spleen', 'Stomach', 'Thyroid'], options_sv: ['Njure', 'Mjälte', 'Magsäck', 'Sköldkörtel'], ans_en: 'Stomach', ans_sv: 'Magsäck', expl_en: 'The stomach breaks down food.', expl_sv: 'Magsäcken bryter ner mat.' }
        ]
    },
    {
        level: 5,
        title_en: 'Cardiovascular System',
        title_sv: 'Hjärt-kärlsystemet',
        description_en: 'Deep dive into the heart and blood vessels.',
        description_sv: 'Djupdykning i hjärtat och blodkärlen.',
        category: 'Cardiovascular',
        questions: [
          { q_en: 'How many chambers does the human heart have?', q_sv: 'Hur många rum har det mänskliga hjärtat?', options_en: ['2', '3', '4', '6'], options_sv: ['2', '3', '4', '6'], ans_en: '4', ans_sv: '4', expl_en: 'The heart has two atria and two ventricles.', expl_sv: 'Hjärtat har två förmak och två kamrar.' },
          { q_en: 'Which blood vessels carry blood away from the heart?', q_sv: 'Vilka blodkärl leder blod bort från hjärtat?', options_en: ['Veins', 'Arteries', 'Capillaries', 'Venules'], options_sv: ['Vener', 'Artärer', 'Kapillärer', 'Venoler'], ans_en: 'Arteries', ans_sv: 'Artärer', expl_en: 'Arteries carry oxygenated blood away (except pulmonary artery).', expl_sv: 'Artärer leder blod bort från hjärtat.' }
        ]
    },
    {
        level: 10,
        title_en: 'Advanced Neuroanatomy',
        title_sv: 'Avancerad neuroanatomi',
        description_en: 'Complex structures of the nervous system.',
        description_sv: 'Komplexa strukturer i nervsystemet.',
        category: 'Nervous',
        questions: [
          { q_en: 'Which cranial nerve is responsible for vision?', q_sv: 'Vilken kranialnerv ansvarar för synen?', options_en: ['I (Olfactory)', 'II (Optic)', 'III (Oculomotor)', 'V (Trigeminal)'], options_sv: ['I (Olfactory)', 'II (Opticus)', 'III (Oculomotorius)', 'V (Trigeminus)'], ans_en: 'II (Optic)', ans_sv: 'II (Opticus)', expl_en: 'Cranial nerve II is the optic nerve.', expl_sv: 'Kranialnerv II är synnerven.' },
          { q_en: 'Which part of the brain controls balance and coordination?', q_sv: 'Vilken del av hjärnan kontrollerar balans och koordination?', options_en: ['Cerebrum', 'Cerebellum', 'Thalamus', 'Medulla'], options_sv: ['Stora hjärnan', 'Lilla hjärnan', 'Thalamus', 'Förlängda märgen'], ans_en: 'Cerebellum', ans_sv: 'Lilla hjärnan', expl_en: 'The cerebellum (little brain) manages balance.', expl_sv: 'Lilla hjärnan (cerebellum) sköter balansen.' }
        ]
    }
  ];

  const insertQuiz = db.prepare(`
    INSERT INTO quizzes (id, title_en, title_sv, description_en, description_sv, difficulty_level, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertQuestion = db.prepare(`
    INSERT INTO questions (id, quiz_id, question_en, question_sv, options_en, options_sv, correct_answer_en, correct_answer_sv, explanation_en, explanation_sv)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Clear existing
  db.prepare('DELETE FROM questions').run();
  db.prepare('DELETE FROM quizzes').run();

  for (const quiz of quizzesData) {
    const quizId = uuidv4();
    insertQuiz.run(quizId, quiz.title_en, quiz.title_sv, quiz.description_en, quiz.description_sv, quiz.level, quiz.category);
    
    for (const q of quiz.questions) {
      insertQuestion.run(
        uuidv4(), 
        quizId, 
        q.q_en, 
        q.q_sv, 
        JSON.stringify(q.options_en), 
        JSON.stringify(q.options_sv), 
        q.ans_en, 
        q.ans_sv, 
        q.expl_en, 
        q.expl_sv
      );
    }
  }

  console.log('Quizzes seeded successfully with multiple levels');
};

if (require.main === module) {
  seedQuizzes();
}
