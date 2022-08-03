function init() {
  const useCases = ['custom', 'advanced', 'managed', 'button']

  useCases.forEach(useCase => {
    document.getElementById(useCase).onclick = function () {
      const url = new URL(useCase, window.location.href);
      const redirectConfirmUrl = document.getElementById("redirectConfirmUrl").value;
      const apScript = document.getElementById("apScript").value;
      const apToken = document.getElementById("apToken").value;
      redirectConfirmUrl && url.searchParams.append('redirectConfirmUrl', redirectConfirmUrl);
      apToken && url.searchParams.append('apToken', apToken);
      apScript && url.searchParams.append('apScript', apScript);
      window.location.href = url;
    };
  }) 
  


  /* js code for the background color and icon color change */ 

const container = document.body;
      const tabOne = document.querySelector(".link1");
      const tabTwo = document.querySelector(".link2");
      const tabThree = document.querySelector(".link3");
      const tabFour = document.querySelector(".link4"); 
      const tabs = document.querySelectorAll(".link");
      tabOne.classList.add("tabone");
      tabOne.addEventListener("click", () => {
        container.style.backgroundColor = "rgb(238, 174, 195)";
        tabOne.classList.add("tabone");
        tabThree.classList.remove("tabone");
        tabTwo.classList.remove("tabone");
        tabFour.classList.remove("tabone");        
      });
      tabTwo.addEventListener("click", () => {
        container.style.backgroundColor = "rgb(178 252 228)";
        tabTwo.classList.add("tabone");
        tabThree.classList.remove("tabone");
        tabOne.classList.remove("tabone");
        tabFour.classList.remove("tabone");
      });
      tabThree.addEventListener("click", () => {
        container.style.backgroundColor = "rgb(245, 233, 67)";
        tabThree.classList.add("tabone");
        tabOne.classList.remove("tabone");
        tabTwo.classList.remove("tabone");
        tabFour.classList.remove("tabone");
      });
      tabFour.addEventListener("click", () => {
        container.style.backgroundColor = "rgb(245, 233, 67)";
        tabFour.classList.add("tabone");
        tabThree.classList.remove("tabone");
        tabOne.classList.remove("tabone");
        tabTwo.classList.remove("tabone");
      });

}


