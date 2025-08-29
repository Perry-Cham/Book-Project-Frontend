   function History_Section() {
    return( <section>
        <h2>Reading History</h2>
        {cbooks ? <div>
          <p>placeholder</p>
        </div> :
          <div>
            <p>You havent started reading anything yet. You'll see how many pages you've read over past week here</p>
          </div>}
      </section>)
   }
  
   export default History_Section;