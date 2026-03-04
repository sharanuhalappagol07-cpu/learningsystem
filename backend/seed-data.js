const db = require('./src/config/db');

async function seedData() {
  try {
    console.log('Starting database seeding...');

    // Insert Subject 1: JavaScript Fundamentals
    const [subject1Id] = await db('subjects').insert({
      title: 'JavaScript Fundamentals',
      slug: 'javascript-fundamentals',
      description: 'Learn the basics of JavaScript programming language from scratch.',
      is_published: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('Created subject: JavaScript Fundamentals (ID:', subject1Id + ')');

    // Insert Sections for Subject 1
    const [section1Id] = await db('sections').insert({
      subject_id: subject1Id,
      title: 'Getting Started with JavaScript',
      order_index: 1,
      created_at: new Date(),
      updated_at: new Date()
    });

    const [section2Id] = await db('sections').insert({
      subject_id: subject1Id,
      title: 'Variables and Data Types',
      order_index: 2,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Insert Videos for Section 1
    await db('videos').insert([
      {
        section_id: section1Id,
        title: 'Introduction to JavaScript',
        description: 'What is JavaScript and why should you learn it?',
        youtube_url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        order_index: 1,
        duration_seconds: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        section_id: section1Id,
        title: 'Setting Up Your Development Environment',
        description: 'How to set up VS Code and run JavaScript code.',
        youtube_url: 'https://www.youtube.com/watch?v=9M4XKi25I2M',
        order_index: 2,
        duration_seconds: 480,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert Videos for Section 2
    await db('videos').insert([
      {
        section_id: section2Id,
        title: 'Variables: let, const, and var',
        description: 'Understanding variable declarations in JavaScript.',
        youtube_url: 'https://www.youtube.com/watch?v=sjyJBL5fkp8',
        order_index: 1,
        duration_seconds: 720,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        section_id: section2Id,
        title: 'Data Types in JavaScript',
        description: 'Learn about strings, numbers, booleans, and more.',
        youtube_url: 'https://www.youtube.com/watch?v=808eYu9B9Yw',
        order_index: 2,
        duration_seconds: 540,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert Subject 2: React.js Basics
    const [subject2Id] = await db('subjects').insert({
      title: 'React.js Basics',
      slug: 'react-js-basics',
      description: 'Build modern web applications with React.js library.',
      is_published: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('Created subject: React.js Basics (ID:', subject2Id + ')');

    // Insert Sections for Subject 2
    const [section3Id] = await db('sections').insert({
      subject_id: subject2Id,
      title: 'Introduction to React',
      order_index: 1,
      created_at: new Date(),
      updated_at: new Date()
    });

    const [section4Id] = await db('sections').insert({
      subject_id: subject2Id,
      title: 'Components and Props',
      order_index: 2,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Insert Videos for Section 3
    await db('videos').insert([
      {
        section_id: section3Id,
        title: 'What is React?',
        description: 'Introduction to React and its core concepts.',
        youtube_url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        order_index: 1,
        duration_seconds: 480,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        section_id: section3Id,
        title: 'Creating Your First React App',
        description: 'Using Create React App to bootstrap a new project.',
        youtube_url: 'https://www.youtube.com/watch?v=9hb_0TZ_MiQ',
        order_index: 2,
        duration_seconds: 600,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert Videos for Section 4
    await db('videos').insert([
      {
        section_id: section4Id,
        title: 'Understanding Components',
        description: 'Learn about functional and class components.',
        youtube_url: 'https://www.youtube.com/watch?v=Cla1WwguArA',
        order_index: 1,
        duration_seconds: 540,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        section_id: section4Id,
        title: 'Working with Props',
        description: 'How to pass data between components using props.',
        youtube_url: 'https://www.youtube.com/watch?v=4UZrsTqkcW4',
        order_index: 2,
        duration_seconds: 480,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert Subject 3: Node.js Fundamentals
    const [subject3Id] = await db('subjects').insert({
      title: 'Node.js Fundamentals',
      slug: 'nodejs-fundamentals',
      description: 'Learn server-side JavaScript with Node.js.',
      is_published: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('Created subject: Node.js Fundamentals (ID:', subject3Id + ')');

    // Insert Section for Subject 3
    const [section5Id] = await db('sections').insert({
      subject_id: subject3Id,
      title: 'Getting Started with Node.js',
      order_index: 1,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Insert Videos for Section 5
    await db('videos').insert([
      {
        section_id: section5Id,
        title: 'Introduction to Node.js',
        description: 'What is Node.js and how does it work?',
        youtube_url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
        order_index: 1,
        duration_seconds: 600,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        section_id: section5Id,
        title: 'Installing Node.js and npm',
        description: 'Setting up Node.js on your machine.',
        youtube_url: 'https://www.youtube.com/watch?v=JINE4D0hjqw',
        order_index: 2,
        duration_seconds: 420,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        section_id: section5Id,
        title: 'Creating Your First Server',
        description: 'Build a simple HTTP server with Node.js.',
        youtube_url: 'https://www.youtube.com/watch?v=VShtPwEkDDU',
        order_index: 3,
        duration_seconds: 540,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    console.log('\nDatabase seeding completed successfully!');
    console.log('Created:');
    console.log('- 3 Subjects');
    console.log('- 5 Sections');
    console.log('- 11 Videos');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
