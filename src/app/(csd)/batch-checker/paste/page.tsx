"use client"

import Widgets from "@/components/dashboard/eligibility-checker/widgets/widgets"
import BatchPasteWidgets from "@/components/dashboard/eligibility-checker/widgets/batch-paste-widgets"
import BatchPasteChecker from "@/components/dashboard/eligibility-checker/batch-paste"
export default function BatchPaste(){
    return (
        <div className="w-full flex flex-col gap-3">
              <div>
                <h1 className="text-2xl text-teiblue font-bold">Eligibility Checker</h1>
                <p className="text-sm text-gray-400 font-light">
                  Dashboard / Checker /{" "}
                  <span className="underline underline-offset-3">Batch (Paste)</span>
                </p>
              </div>

              <BatchPasteWidgets numberOfAcc={0} eligible={"-"} expired={"-"} claimed={"-"} notFound={"-"}/>
                <BatchPasteChecker/>
            
            </div>
    )
}   