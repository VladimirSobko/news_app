
	const apiKey = "572e97d6cbdb4550932b203f915811fe";
		const apiURL = "https://news-api-v2.herokuapp.com";
		let choice = "ua";
		let category = "sport"
		let searchNewsValue = "";
		const form = document.querySelector("form");
		const select = document.querySelector(".select-country");
		const searchNews = document.querySelector("#search-id");
		const blockOfnews = document.querySelector(".news-container");
		const choiceCategories = document.querySelector(".choice-categories");
		const btn = document.querySelector("#btn-search");

		//events for button 
		btn.addEventListener("click", (event)=>{
			if(event && searchNews.value === ""){
				event.preventDefault();
				return;
			}
			else if(event){
				searchNewsValue = searchNews.value;
				event.preventDefault();
				blockOfnews.innerHTML = "";
				form.reset();
				getKeyWordPost();	
			}	
			
		});

		select.addEventListener("change", function (event){
				if(event){
					choice = this.value;// смена страны
					blockOfnews.innerHTML = "";
					// form.reset();
					getPost();

				}
			})
			
		choiceCategories.addEventListener("change", function(event){
			if(event){
				searchNewsValue = "";
				category = this.value;// смена категории поиска по интересам пользователя
				blockOfnews.innerHTML = "";
				// form.reset();
					getPost();
					
			}
		});
			


				function getDefaultNews(){ // выводит на страницу новости по умолчанию
					const xhr = new XMLHttpRequest();
					xhr.open("GET", `${apiURL}/top-headlines?country=${choice}&category=${category}&apiKey=${apiKey}`);
					xhr.addEventListener("load", () => {
						const response = JSON.parse(xhr.responseText);
						try{
							if(response.status ==="ok"){
								response.articles.forEach((el) =>{
									renderNews(el)
								});
							}
						}
						catch(error){
							console.log(error);
						}
					});
					xhr.send();
				};
				getDefaultNews();

		function getPost(){
			const xhr = new XMLHttpRequest();
			xhr.open("GET", `${apiURL}/top-headlines?country=${choice}&category=${category}&apiKey=${apiKey}`);
			xhr.addEventListener("load", () => {
				const response = JSON.parse(xhr.responseText);
				try{
					if(response.status ==="ok"){
						response.articles.forEach((el) =>{
							renderNews(el)
						});
					}
				}
				catch(error){
					console.log(error);
				}
			});
			xhr.send();
		};
	

		function renderNews(news){
			const cardOfNews = document.createElement("div");
			const titleOfNews = document.createElement("h5");
			const articlesOfNews = document.createElement("p");
			const imgOfNews = document.createElement("img");
			blockOfnews.appendChild(cardOfNews);
			cardOfNews.appendChild(titleOfNews);
			cardOfNews.appendChild(articlesOfNews);
			articlesOfNews.textContent = news.description;
			titleOfNews.textContent = news.title;
			imgOfNews.setAttribute("src", `${news.urlToImage}`);
			imgOfNews.setAttribute("max-width", "500px");
			imgOfNews.classList.add("card-img-top");
			cardOfNews.appendChild(imgOfNews);
			cardOfNews.classList.add("card");
		}
		
			function getKeyWordPost(){
				const xhr = new XMLHttpRequest();
				xhr.open("GET", `${apiURL}/everything?q=${searchNewsValue}&apiKey=${apiKey}`);
				xhr.addEventListener("load", () => {
					const response = JSON.parse(xhr.responseText);
						if(response.status ==="ok"){
							response.articles.forEach((el) =>{
								renderNews(el)
							});
						}
				});
				xhr.send();
			}

			
// 1. Добавить в форму селект для выбора категории.

// 2. Добавить обработку формы. При сабмите формы должен отправляться запрос на получение новостей по выбранной категории и стране, если в инпуте search есть какое то значение то нужно делать запрос на everething и передавать то что ввел пользователь.

// 3. Добавить условие. Если у новости нет картинки то подставлять картинку заглушку. Картинку заглушку можете выбрать самостоятельно из интернета.