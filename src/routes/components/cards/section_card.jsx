function SectionCard({imageSource, heading, mainText, imgClass, bodyClass}){
  return(
    <section className="sectionCard grid grid-cols-1 md:grid-cols-2 md:min-h-[25vh] border-b-2">
      <figure className={`image w-100 h-100 ${imgClass}`}>
        <img className="" src={imageSource}></img>
      </figure>
      
      <article className={`md:${bodyClass} flex justify-center items-center`}>
        <div>
        <h2>{heading}</h2>
        <p>{mainText}</p>
        </div>
      </article>
    </section>
    )
}

export default SectionCard;