import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const teamMembers = [
  {
    name: 'Aromal S',
    role: 'Full Stack Developer',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor odio a quam commodo, nec maximus metus finibus.',
    image: 'https://chingizpro.github.io/portfolio/img/person.png', // Add the path to the image file
  },
  {
    name: 'Noel Jose T P',
    role: 'Frontend Developer',
    bio: 'Sed tincidunt augue eu enim accumsan aliquam. Sed lacinia augue id odio condimentum eleifend.',
    image: 'https://chingizpro.github.io/portfolio/img/person.png', // Add the path to the image file
  },
  {
    name: 'Sneha S Kunar',
    role: 'Blockchain Developer',
    bio: 'Sed tincidunt augue eu enim accumsan aliquam. Sed lacinia augue id odio condimentum eleifend.',
    image: 'https://chingizpro.github.io/portfolio/img/person.png', // Add the path to the image file
  },
  {
    name: 'Bimal Murali',
    role: 'UI UX Designer',
    bio: 'Sed tincidunt augue eu enim accumsan aliquam. Sed lacinia augue id odio condimentum eleifend.',
    image: 'https://chingizpro.github.io/portfolio/img/person.png', // Add the path to the image file
  },
  // Add more team members as needed
];

const CreditsPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold mb-8">Project Credits</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-center mb-4">
                  <Image src={member.image} alt={member.name} width={150} height={150} className="rounded-full" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <p className="text-gray-800">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreditsPage;
