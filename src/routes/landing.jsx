import SectionCard from './components/cards/section_card';
function LandingPage (){
  return(
  <>
<SectionCard 
heading={"Welcome to P's Books"}
mainText={"A project of mine to nurture reading and the love the of it of course."}
imgClass={"col-start-2"}
bodyClass={"col-start-1"}
/>
<SectionCard 
heading={"Save Books To Read Later"}
mainText={"You can save books to your profile so that you never lose them. Then you can back to them later when you feel like scartching that literary itch."}
imgClass={"col-start-1"}
bodyClass={"col-start-2"}
/>
<SectionCard
heading={"Set Goals To Keep Track Of Progress"}
mainText={"Perfect for students who want to be accountablebwith their studies or get through a baclog of work"}
imgClass={"col-start-2"}
bodyClass={"col-start-1"}
/>
<SectionCard 
heading={"Download Books To Your Device"}
mainText={"If you find one particularly interesting your free to download it and share it with someone else."}
imgClass={"col-start-1"}
bodyClass={"col-start-2"}
/>
<section className="min-h-[25vh] flex justify-center items-center flex-col">
  <h2 className="text-center my-4 text-uppercase">Get Started</h2>
  <div className="flex justify-center items-center">
  <button className="bg-blue-900 text-white px-4 mx-4">Login</button>
  <button className="border-2 border-blue-900 px-4 mx-4">Sign Up</button>
  </div>
</section>
  </>)
}
export default LandingPage;