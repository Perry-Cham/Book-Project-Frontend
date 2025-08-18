import SectionCard from './components/cards/section_card';
function LandingPage (){
  return(
  <>
<h1>Welcome to P's Books</h1>
<p>A project of mine to nurture reading and the love the of it of course.</p>
<SectionCard 
heading={"Save Books To Read Later"}
mainText={"You can save books to your profile so that you never lose them. Then you can back to them later when you feel like scartching that literary itch."}
/>
<SectionCard
heading={"Set Goals To Keep Track Of Progress"}
mainText={"Perfect for students who want to be accountablebwith their studies or get through a baclog of work"}
/>
<SectionCard 
heading={"Download Books To Your Device"}
mainText={"If you find one particularly interesting your free to download it and share it with someone else."}
/>
  </>)
}
export default LandingPage;