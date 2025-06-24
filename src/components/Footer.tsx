import Link from "next/link";

import { 
    FiInstagram,
    FiLinkedin,
    FiYoutube,
    FiMail
} from "react-icons/fi";


export default function Footer() {
    return (
        <footer className="flex justify-center w-full bg-slate-100">
            <div className="w-4/6 py-8">
                <div className="flex flex-row">

                    <div className='flex flex-col space-y-3 w-3/6 text-gray-500'>
                        <div>Finding Finance Association is a 501(c)(3) nonprofit organization</div>
                        <div>We are dedicated to guiding undergraduate students through the diverse career paths in finance</div>
                        <div>1 Brookings Drive, St. Louis, MO 63130</div>
                    </div>

                    <div className="flex flex-row w-3/6 ml-auto">
                        <div className="flex flex-col space-y-3 text-gray-800 ml-auto">
                            <div className="text-gray-500">Navigation</div>
                            <Link href={"/"} className="hover:text-green-700">Home</Link>
                            <Link href={"/courses"} className="hover:text-green-700">Courses</Link>
                            <Link href={"/events"} className="hover:text-green-700">Events</Link>
                            <Link href={"/newsletters"} className="hover:text-green-700">Newsletters</Link>
                        </div>

                        <div className="flex-col space-y-3 text-gray-800 ml-auto">
                            <div className="text-gray-500">Links</div>

                            <a href={"https://www.instagram.com/washufindingfinance/"}
                            target="_blank" rel="noopener noreferrer"
                            className="flex flex-row items-center space-x-1 hover:text-green-700 duration-200">
                                <FiInstagram className="text-xl"/>
                                <div>Instagram</div>
                            </a>

                            <a href={"https://www.linkedin.com/company/finding-finance-association/"}
                            target="_blank" rel="noopener noreferrer"
                            className="flex flex-row items-center space-x-1 hover:text-green-700 duration-200">
                                <FiLinkedin className="text-xl"/>
                                <div>LinkedIn</div>
                            </a>

                            <a href={"https://www.youtube.com/@WashU-FFA"}
                            target="_blank" rel="noopener noreferrer"
                            className="flex flex-row items-center space-x-1 hover:text-green-700 duration-200">
                                <FiYoutube className="text-xl"/>
                                <div>YouTube</div>
                            </a>

                            <a href={"mailto:findingfinanceassociation@gmail.com"}
                            target="_blank" rel="noopener noreferrer"
                            className="flex flex-row items-center space-x-1 hover:text-green-700 duration-200">
                                <FiMail className="text-xl"/>
                                <div>Email</div>
                            </a>
                            
                        </div>
                    </div>
                   
                </div>
                <div className="mt-8 border-t border-gray-300 pt-4 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Finding Finance Association. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
