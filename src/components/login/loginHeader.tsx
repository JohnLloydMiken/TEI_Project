"use client";

import * as React from "react";
import Image from "next/image";

export default function LoginHeader() {
  return (
    <header className="min-w-full flex flex-col justify-center bg-white ">
      <div className="w-full bg-teiblue p-2">
        <div className="max-w-9/12 mx-auto flex flex-row justify-between items-center">
          <p className="text-xs uppercase text-gray-400">
            Tarlac Electric Inc. - internal system
          </p>
          <p className="text-xs uppercase text-gray-400">Bill Deposit Refund</p>
        </div>
      </div>

      <div className="w-full border-b-4 border-b-teiorange">
        <div className="flex flex-row py-6 max-w-9/12 mx-auto  items-center">
          <Image
            src={"/tei-logo.png"}
            width={100}
            height={100}
            alt="tei-logo"
            className="w-auto h-auto aspect-auto"
          />
          <div className="flex flex-row space-x-2 justify-center items-center">
            <div>
              <p className="text-2xl text-teiblue font-bold">Bill Deposit Refund System</p>
              <p className="text-sm text-gray-400">Customer Service Portal</p>
            </div>
            <div className="p-2 rounded-lg bg-teiorange h-fit">
              <p className="text-white uppercase text-xs">internal</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
