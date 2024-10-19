import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Navbar from "../components/navbar";
import CityImage from "../components/CityImage";
import FloorButtons from "../components/FloorButtons";
import TopOffers from "../components/TopOffers";
import { CategorySearch } from "../components/CategorySearch";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.5 } },
};

const IndividualMall = () => {
  const { mallId, locationId } = useParams();
  const navigate = useNavigate();
  const [mallData, setMallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const fetchMallData = async () => {
      setLoading(true);
      try {
        if (!mallId || !locationId) {
          throw new Error("Mall ID or Location ID is missing");
        }

        console.log("Fetching mall data for mallId:", mallId);
        const mallRef = doc(db, "mallChains", mallId);
        const mallSnap = await getDoc(mallRef);

        if (mallSnap.exists()) {
          const mallData = { id: mallSnap.id, ...mallSnap.data() };
          console.log("Mall data fetched:", mallData);

          console.log("Fetching location data for locationId:", locationId);
          const locationRef = doc(
            db,
            "mallChains",
            mallId,
            "locations",
            locationId,
          );
          const locationSnap = await getDoc(locationRef);

          if (locationSnap.exists()) {
            const locationData = {
              id: locationSnap.id,
              ...locationSnap.data(),
            };
            console.log("Location data fetched:", locationData);
            setMallData({ ...mallData, location: locationData });

            // Fetch floor layout
            console.log("Fetching floor layout");
            const floorLayoutRef = collection(
              db,
              "mallChains",
              mallId,
              "locations",
              locationId,
              "floorLayout",
            );
            const floorLayoutSnap = await getDocs(floorLayoutRef);

            if (floorLayoutSnap.empty) {
              console.warn("No floor layout found for this location");
              setFloors([]);
            } else {
              const floorData = floorLayoutSnap.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
              }));
              console.log("Floor layout fetched:", floorData);
              setFloors(floorData);
            }
          } else {
            throw new Error("Location not found");
          }
        } else {
          throw new Error("Mall not found");
        }
      } catch (error) {
        console.error("Error fetching mall data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMallData();
  }, [mallId, locationId, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!mallData) return <div>No data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-300 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <CityImage
          cityName={mallData.location?.name || "N/A"}
          imageUrl={mallData.location?.imageUrl}
        />
        <div className="mb-8 rounded-lg bg-white p-4 shadow-lg sm:p-6">
          <h1 className="mb-8 text-center text-3xl font-bold text-mainTextColor sm:text-4xl">
            <span className="border-b-4 border-blue-500 pb-2">
              {mallData.location?.name || "N/A"}
            </span>
          </h1>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search for stores, brands, or items"
              className="w-full rounded-full border-2 border-blue-500 bg-gray-100 px-4 py-2 pr-10 text-base focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:px-6 sm:py-3 sm:text-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 sm:right-4">
              <FaSearch className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <FloorButtons floors={floors} />
          <TopOffers />
        </div>
        <div className="rounded-lg bg-sky-50 p-4 shadow-lg sm:p-8">
          <CategorySearch />
        </div>
      </div>
      <footer className="border-t-2 border-slate-400 bg-transparent py-8">
        <div className="container mx-auto px-6 md:flex md:justify-around">
          <motion.div
            className="flex flex-wrap justify-between md:space-x-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="mb-6 md:mb-0">
              <h5 className="mb-2 text-lg font-bold text-blue-900">Product</h5>
              <ul className="space-y-1 text-blue-900">
                <li>
                  <a href="#">Solutions</a>
                </li>
                <li>
                  <a href="#">Analytics</a>
                </li>
                <li>
                  <a href="#">Tokens</a>
                </li>
              </ul>
            </div>
            <div className="mb-6 md:mb-0">
              <h5 className="mb-2 text-lg font-bold text-blue-900">About Us</h5>
              <ul className="space-y-1 text-blue-900">
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Malls</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>
            <div className="mb-6 md:mb-0">
              <h5 className="mb-2 text-lg font-bold text-blue-900">
                Help & Support
              </h5>
              <ul className="space-y-1 text-blue-900">
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="#">Privacy and Terms</a>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* App Store Links */}
          <motion.div
            className="flex flex-col items-start space-y-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: false, amount: 0.2 }}
          >
            <a href="#">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="w-36"
              />
            </a>
            <a href="#">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
                className="w-36"
              />
            </a>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="container mx-auto mt-8 flex items-center justify-between border-t-2 border-slate-400 px-6 pt-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          exit="hidden"
          viewport={{ once: false, amount: 0.2 }}
        >
          <p className="text-blue-900">© 2024 MallEZ</p>
          <div className="flex space-x-4">
            <a href="#" className="text-2xl text-[#E4405F]">
              <FaInstagram />
            </a>
            <a href="#" className="text-2xl text-[#1DA1F2]">
              <FaTwitter />
            </a>
            <a href="#" className="text-2xl text-[#0077B5]">
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default IndividualMall;
