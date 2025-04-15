import { MapPin, Menu } from "lucide-react";
import { useState } from "react";

// Sample data for multiple cards
const cardData = [
  {
    id: 1,
    status: "OPEN",
    experience: "Preferred Exp: 2 – 4 years",
    title: "UX Designer",
    company: "For ITG Communications",
    location: "Tennessee",
    remote: "Remote",
    recruiters: ["https://i.pravatar.cc/300", "https://i.pravatar.cc/301"],
    ctc: "10%",
    description:
      "We are looking for a passionate UX Designer to work on enhancing the user experience of our flagship products. You will collaborate closely with product teams to create user-centered designs and conduct usability testing.",
  },
  {
    id: 2,
    status: "CLOSED",
    experience: "Preferred Exp: 5 – 7 years",
    title: "Frontend Developer",
    company: "For XYZ Technologies",
    location: "California",
    remote: "Hybrid",
    recruiters: ["https://i.pravatar.cc/300", "https://i.pravatar.cc/301"],
    ctc: "15%",
    description:
      "XYZ Technologies is seeking a skilled Frontend Developer to join our team. The ideal candidate will have expertise in JavaScript frameworks and a strong understanding of responsive web design to build and maintain high-performance web applications.",
  },
  {
    id: 3,
    status: "OPEN",
    experience: "Preferred Exp: 3 – 5 years",
    title: "Product Manager",
    company: "For ABC Solutions",
    location: "New York",
    remote: "Remote",
    recruiters: ["https://i.pravatar.cc/302", "https://i.pravatar.cc/303"],
    ctc: "12%",
    description:
      "As a Product Manager at ABC Solutions, you will drive the product roadmap and collaborate with cross-functional teams to ensure successful product launches. Strong communication and project management skills are essential.",
  },
  {
    id: 4,
    status: "OPEN",
    experience: "Preferred Exp: 1 – 3 years",
    title: "Graphic Designer",
    company: "For Creative Agency",
    location: "Texas",
    remote: "In-office",
    recruiters: ["https://i.pravatar.cc/304", "https://i.pravatar.cc/305"],
    ctc: "8%",
    description:
      "Creative Agency is hiring a Graphic Designer to work on a variety of branding, digital, and print design projects. You will collaborate with the creative team to develop visually compelling materials that meet client goals.",
  },
  {
    id: 5,
    status: "OPEN",
    experience: "Preferred Exp: 2 – 4 years",
    title: "Backend Developer",
    company: "For Tech Corp",
    location: "Florida",
    remote: "Remote",
    recruiters: ["https://i.pravatar.cc/306", "https://i.pravatar.cc/307"],
    ctc: "20%",
    description:
      "Tech Corp is looking for a Backend Developer to design and implement server-side logic, database systems, and APIs. You'll play a key role in optimizing the performance of our backend infrastructure.",
  },
  {
    id: 6,
    status: "CLOSED",
    experience: "Preferred Exp: 4 – 6 years",
    title: "Data Scientist",
    company: "For DataLabs",
    location: "Illinois",
    remote: "Hybrid",
    recruiters: ["https://i.pravatar.cc/308", "https://i.pravatar.cc/309"],
    ctc: "18%",
    description:
      "DataLabs is seeking a Data Scientist to analyze complex datasets and provide actionable insights. You’ll work closely with product and engineering teams to create predictive models and improve business outcomes.",
  },
];

const DashboardCard = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const toggleHover = () => setIsHovered(!isHovered);
  const toggleClick = () => setIsClicked(!isClicked);

  return (
    <div
      className={`bg-white p-4 rounded-2xl shadow-md border border-gray-200 max-w-md w-full transition-transform transform ${
        isHovered ? "scale-105 shadow-xl" : ""
      }`}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      onClick={toggleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-[10px] font-semibold px-3 py-1 rounded-md ${
            card.status === "OPEN"
              ? "bg-indigo-100 text-indigo-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {card.status}
        </span>
        <span
          className={`${
            card.status === "OPEN"
              ? "bg-indigo-50 text-indigo-600"
              : "bg-red-100 text-red-600"
          } text-xs font-[500] px-3 py-1 rounded-md`}
        >
          {card.experience}
        </span>
      </div>

      <div className="mb-1">
        <h2 className="mt-4 text-[15px] font-bold text-[#1E293B]">
          {card.title}
        </h2>
        <p className="mt-1 text-[12px] text-[#1E293B]">{card.company}</p>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 my-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{card.location}</span>
        </div>
        <span className="text-[12px] font-medium">{card.remote}</span>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Assigned Recruiters</p>
          <div className="flex -space-x-2">
            {card.recruiters.map((recruiter, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src={recruiter}
                  alt={`Recruiter ${index + 1}`}
                />
                {isHovered && (
                  <div className="absolute bottom-0 left-0 w-full bg-black text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Recruiter {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${
            card.status === "OPEN"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-red-100 text-red-700"
          } text-[11px] font-semibold px-2 py-1 rounded-xl`}
        >
          CTC : {card.ctc}
        </div>
      </div>

      {isClicked && (
        <div className="mt-4 p-2 bg-gray-100 rounded-xl text-xs text-gray-700">
          <p>{card.description}</p>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [filter, setFilter] = useState("ALL");

  const filteredCards = cardData.filter(
    (card) => filter === "ALL" || card.status === filter
  );

  return (
    <div className="p-4">
      {/* <div className="bg-white flex flex-1/3 gap-4 mb-4">
        <div className="flex">
        <div><Menu /> All Positions</div>
        <div>Open Positions</div>
        <div>Closed Positions</div>
        <div>Inprogress Positions</div>
        </div>
        <div></div>
        <div></div>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-4">
        {filteredCards.map((card) => (
          <DashboardCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
