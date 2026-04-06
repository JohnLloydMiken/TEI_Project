"use client"



export default function FooterLayout () {

  return (
    <footer className={`bg-teiblue min-w-full p-6`}>
        <div className="max-w-9/12 mx-auto flex flex-row justify-between items-center">
            <p className="text-xs uppercase text-gray-400">@ 2026 Tarlac Electric Inc.</p>
            <p className="text-xs uppercase text-gray-400">v1.0 - Internal Use Only</p>
        </div>
    </footer>
  );
}
