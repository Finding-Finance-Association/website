import Image from 'next/image';


export default function Footer() {
    return (
        <footer className="w-full bg-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between h-16">      
                    <div className="flex items-center space-x-3 group">
                        <Image
                        src="/images/ffa-logo.png"
                        alt="FFA logo"
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-gray-100"
                        />
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">
                            Finding Finance Association
                        </span>
                    </div>    
                </div>

                {/*TODO: icons ? react-icons library*/}
                <div className="flex flex-row items-centeralign-top">
                    <div className="flex-col w-3/6 space-y-2">
                        <div className="text-lg font-semibold">Contact Us</div>
                        <div>Instagram: @washufindingfinance</div>
                        <div>LinkedIn: finding-finance-association</div>
                        <div>YouTube: WashU-FFA</div>
                        <div>Email: findingfinanceassociation@gmail.com</div>
                    </div>

                    <div className="flex-col w-3/6">
                        <div className="text-lg font-semibold">Location</div>
                        1 Brookings Drive,<br/>
                        St. Louis,<br/>
                        MO 63130
                    </div>
                </div>
                
            </div>
        </footer>
    );
};
