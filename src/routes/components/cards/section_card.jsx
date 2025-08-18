function SectionCard({imageSource, heading, mainText}){
  return(
    <section className="sectionCard">
      <figure className="image">
        <img src={imageSource}></img>
      </figure>
      
      <article className="body">
        <h2>{heading}</h2>
        <p>{mainText}</p>
      </article>
    </section>
    )
}

export default SectionCard;