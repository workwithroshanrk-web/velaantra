"use client";
import { useEffect } from "react";
import { siteContent } from "./site-content";
export default function Home() {
 useEffect(() => {
  const form = document.querySelector<HTMLFormElement>("#enquiry-form");
  const role = document.querySelector<HTMLSelectElement>("#role");
  const farmer = document.querySelector<HTMLElement>("#farmer-fields");
  const status = document.querySelector<HTMLElement>("#form-status");
  if (!form || !role || !farmer || !status) return;
  const toggle = () => {
   const isFarmer = role.value === "farmer";
   farmer.hidden = !isFarmer;
   for (const name of ["crops", "landSize", "currentMethod"]) {
    const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
    if (field) {
     field.disabled = !isFarmer;
     field.required = isFarmer && name !== "currentMethod";
    }
   }
  };
  const submit = async (event: SubmitEvent) => {
   event.preventDefault(); status.textContent="Sending your enquiry…"; const button=form.querySelector<HTMLButtonElement>("button[type=submit]"); if(button) button.disabled=true;
   try {const data=Object.fromEntries(new FormData(form).entries()); const response=await fetch("/api/enquiries", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}); const result=await response.json().catch(()=>({error:"The service is temporarily unavailable."})); if(!response.ok) throw new Error(typeof result.error === "string" ? result.error : "The service is temporarily unavailable."); form.reset();toggle();status.textContent="Thank you. Your enquiry has been received.";} catch(error) {status.textContent=error instanceof Error ? error.message : "We couldn't send your enquiry. Please try again.";} finally {if(button) button.disabled=false;}
  };
  toggle(); role.addEventListener("change",toggle); form.addEventListener("submit",submit); return () => {role.removeEventListener("change",toggle);form.removeEventListener("submit",submit);};
 },[]);
 return <div dangerouslySetInnerHTML={{__html:siteContent}}/>;
}
