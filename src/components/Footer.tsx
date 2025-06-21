import Link from "next/link";

import { 
    FiInstagram,
    FiLinkedin,
    FiYoutube,
    FiMail
} from "react-icons/fi";


export default function Footer() {
    return (
        <footer className="w-full bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-row space-x-20">
                    {/* first column: info */}
                    <div className='flex flex-col space-y-4 w-3/6 text-gray-500'>
                        <div>Finding Finance Assosiation is a 501(c)(3) nonprofit organization</div>
                        <div>We are dedicated to guiding undergraduate students through the diverse career paths in finance</div>
                        <div>1 Brookings Drive, St. Louis, MO 63130</div>
                    </div>

                    {/* second column: links */}
                    <div className="flex flex-col space-y-2">
                        <div className="text-gray-500">Navigation</div>
                        <div className="flex flex-col space-y-2 text-gray-800">
                            <Link href={"/"} className="hover:text-green-700">Home</Link>
                            <Link href={"/courses"} className="hover:text-green-700">Courses</Link>
                            <Link href={"/events"} className="hover:text-green-700">Events</Link>
                            <Link href={"/newsletters"} className="hover:text-green-700">Newsletters</Link>
                        </div>
                    </div>

                    {/* socials/contact column */}

                   
                    <div className="flex-col w-2/6 space-y-2 text-gray-800">
                        <div className="text-gray-500">Links</div>

                        <a href={"https://www.instagram.com/washufindingfinance/"}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-row space-x-1 hover:text-green-700 duration-200">
                            <FiInstagram className="text-xl"/>
                            <div>Instagram</div>
                        </a>

                        <a href={"https://www.linkedin.com/company/finding-finance-association/"}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-row space-x-1 hover:text-green-700 duration-200">
                            <FiLinkedin className="text-xl"/>
                            <div>LinkedIn</div>
                        </a>

                        <a href={"https://www.youtube.com/@WashU-FFA"}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-row space-x-1 hover:text-green-700 duration-200">
                            <FiYoutube className="text-xl"/>
                            <div>YouTube</div>
                        </a>

                        <a href={"mailto:findingfinanceassociation@gmail.com"}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-row space-x-1 hover:text-green-700 duration-200">
                            <FiMail className="text-xl"/>
                            <div>Email</div>
                        </a>
                        
                    </div>
                        

                </div>
                
            </div>
        </footer>
    );
};
