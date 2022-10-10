const burgerBtn = document.querySelector('.fa-bars')
const closeNavMobileBtn = document.querySelector('.fa-xmark')
const navControls = document.querySelector('.nav-controls')
const navMobile = document.querySelector('.nav-mobile')
const navDesktop = document.querySelector('.nav-desktop')

const sectionAll = document.querySelector('#all')
const sectionGryffindor = document.querySelector('#gryffindor')
const sectionSlytherin = document.querySelector('#slytherin')
const sectionHufflepuff = document.querySelector('#hufflepuff')
const sectionRavenclaw = document.querySelector('#ravenclaw')
const sectionFavorites = document.querySelector('#favorites')

const allApiURL = 'https://hp-api.herokuapp.com/api/characters'

const main = document.querySelector('main')
const modal = document.querySelector('.modal')
const bgCover = document.querySelector('.bg-cover')

const categories = [sectionAll, sectionGryffindor, sectionHufflepuff, sectionRavenclaw, sectionSlytherin, sectionFavorites]

let defaultData = []
let gryffindorData = []
let slytherinData = []
let hufflepuffData = []
let ravenclawData = []
let favoritesData = []
let sortedData = []
let sectionAndData = []


const handleNavigation = nav => {
    const navBtns = nav.querySelectorAll('.category-btn')
    const footer = document.querySelector('footer')
    for (const navBtn of navBtns) {
        navBtn.addEventListener('click', e => {
            footer.style.display = 'block'
            for (const category of categories) {
                if (category.classList.contains('d-block'))
                    category.classList.remove('d-block')
                if (category.getAttribute('id') === navBtn.getAttribute('category'))
                    category.classList.add('d-block')
            }
            const section = document.querySelector(`#${navBtn.getAttribute('category')}`);
            if (nav.classList.contains('nav-mobile')) {
                switch (section.getAttribute('id')) {
                    case 'all': handleMobileListAndFavorites(section, defaultData)
                        break;
                    case 'gryffindor': handleMobileListAndFavorites(section, gryffindorData)
                        break;
                    case 'slytherin': handleMobileListAndFavorites(section, slytherinData)
                        break;
                    case 'hufflepuff': handleMobileListAndFavorites(section, hufflepuffData)
                        break;
                    case 'ravenclaw': handleMobileListAndFavorites(section, ravenclawData)
                        break;
                    case 'favorites': handleFavoriteMobile()
                        break;
                }
                navBtn.classList.add('d-block')
                navControls.style.transform = 'translateX(-100%)'
                window.scrollTo(0, 0)
            }
            if (section.getAttribute('id') === 'favorites') {
                footer.style.display = 'none'
                fillFavorites()
                return
            }
            resetSortSection(section)
        })
    }
}

const createTables = () => {
    for (const section of categories) {
        section.innerHTML =
            `<div class="sort">
                <span>Sort by:</span>
                <select class="sort-select">
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="wizard">Wizard</option>
                </select>
                <i class="fa-solid fa-arrow-up-short-wide rotate-180"></i>
                <i class="fa-solid fa-arrow-up-wide-short rotate-180"></i>
            </div>
            <h1>${section.getAttribute('id') === 'all' ? 'All students' : section.getAttribute('id')}</h1>
            <div class="mobile">
                <div class="loading">Wczytywanie...</div>
            </div>
            <div class="desktop">
                <table>
                <thead>
                <th class="first-page">Name</th>
                <th class="first-page">Date of Birth</th>
                <th>Wizard</th>
                <th>Ancestry</th>
                <th>Is student/staff</th>
                </thead>
                <tbody>
                <div class="loading">Wczytywanie...</div>
                </tbody>
                </table>
            </div>`
    }
}

const fillTable = (data, section) => {
    section.querySelector('.loading').style.display = 'none'
    
    const tableBody = section.querySelector('tbody')
    tableBody.innerHTML = ''
    for (const obj of data) {
        tableBody.innerHTML += (
            `<tr class="show-card">
            <td>${obj.name}</td>
            <td>${obj.dateOfBirth}</td>
            <td>${obj.wizard ? 'yes' : 'no'}</td>
            <td>${obj.ancestry}</td>
            <td>
                ${obj.hogwartsStudent ? 'student' : ''}
                ${obj.hogwartsStaff ? 'staff' : ''}
            </td>
        </tr>`
        )
    }
    fillModal(section)
}

const createFavorites = () => {
    sectionFavorites.innerHTML =
        `<div class="display-controls">
            <span>Cards in row:</span>
            <i class="ti ti-square-number-1"></i>
            <i class="ti ti-square-number-3"></i>
            <i class="ti ti-square-number-5"></i>
        </div>
        <div class="mobile"></div>
        <div class="desktop">
            <div class="container"></div>
        </div>`
}


const fillFavorites = () => {
    let favCardId = 0
    const container = sectionFavorites.querySelector('.container')
    container.innerHTML = ''
    if (favoritesData.length === 0)
        container.innerHTML = 'No cards added to favorites'
    else {
        for (const item of favoritesData) {
            container.innerHTML +=
                `<div class="card">
                <img src=${item.image} alt="">
                <h4>${item.name}</h4>
                <button>
                    <i class=" fa-solid fa-heart" id=${favCardId++}></i>
                </button>
            </div>`
        }
        const cards = container.querySelectorAll('.card')

        sectionFavorites.querySelector('.ti-square-number-1').addEventListener('click', () => {
            for (const card of cards) {
                card.style.width = '50%'
                card.style.height = '95%'
                card.style.fontSize = '1.3rem'
                card.style.overflow = 'hidden'
            }
        })
        sectionFavorites.querySelector('.ti-square-number-3').addEventListener('click', () => {
            for (const card of cards) {
                card.style.width = '25%'
                card.style.height = '70%'
                card.style.fontSize = '1.3rem'
                card.style.overflow = 'hidden'
            }
        })
        sectionFavorites.querySelector('.ti-square-number-5').addEventListener('click', () => {
            if (favoritesData.length > 4) {
                for (const card of cards) {
                    card.style.width = '14%'
                    card.style.height = '40%'
                    card.style.fontSize = '1rem'
                    card.style.overflow = 'visible'
                }
            }
        })

        for (const card of cards) {
            card.querySelector('.fa-heart').addEventListener('click', e => {
                favoritesData = favoritesData.filter(item => item !== favoritesData[e.target.id])
                updateLocalStorage()
                fillFavorites()
            })
        }
    }
}

const createList = (section, data) => {
    let personId = 0
    const mobileDiv = section.querySelector('.mobile')
    mobileDiv.innerHTML = ``
    for (const obj of data) {
        mobileDiv.innerHTML += (
            `<div class="person">
                    <div class="person__top">
                        <img src="${obj.image}" alt="Portrait of ${obj.name}" loading="lazy"/>
                        <div class="person__top__data">
                            <p class="person__data-title">Name:</p>
                            <span>${obj.name}</span>
                            <p class="person__data-title">Date of birth:</p>
                            <span>${obj.dateOfBirth === '' ? 'no data' : obj.dateOfBirth}</span>
                            <p class="person__data-title">Wizard:</p>
                            <span>${obj.wizard ? 'yes' : 'no'}</span>
                        </div>
                        ${isInFavorites(obj) ? `<i class="fa-solid fa-heart red-heart" id="heart${personId}"></i>` : `<i class="fa-solid fa-heart" id="heart${personId}"></i>`}
                    </div>
                    <div class="person__bottom">
                        <p>
                            <span class="person__data-title">Ancestry:</span>
                            <span>${obj.ancestry === '' ? 'no data' : obj.ancestry}</span>
                        </p>
                        <p>
                            <span class="person__data-title">Is student/staff:</span>
                            <span>
                                ${obj.hogwartsStudent ? 'student' : ''}
                                ${obj.hogwartsStaff ? 'staff' : ''}
                            </span>
                        </p>
                    </div>
                </div>`)

        personId++
    }
}


const createFavoritesMobile = () => {
    let personId = 0
    const mobileDiv = sectionFavorites.querySelector('.mobile')
    fillFavoritesFromLocalStorage()
    data = [...favoritesData]
    mobileDiv.innerHTML = `<h1>${sectionFavorites.getAttribute('id')}</h1>`
    for (const obj of data) {
        data = []
        mobileDiv.innerHTML += (
            `<div class="person">
                    <div class="person__top">
                        <img src="${obj.image}" alt="Portrait of ${obj.name}" loading="lazy"/>
                        <div class="person__top__data">
                            <p class="person__data-title">Name:</p>
                            <span>${obj.name}</span>
                        </div>
                        ${isInFavorites(obj) ? `<i class="fa-solid fa-heart red-heart" id="heart${personId}"></i>` : `<i class="fa-solid fa-heart" id="heart${personId}"></i>`}
                    </div>
                </div>`)
        personId++
    }
}

const handleMobileListAndFavorites = (section, data) => {
    let i = 0
    createList(section, data)
    for (const obj of data) {
        const btn = section.querySelector(`#heart${i++}`)
        btn.addEventListener('click', () => handleFavorites(btn, obj))
    }
}

function handleFavoriteMobile() {
    let i = 0
    createFavoritesMobile()
    for (const obj of favoritesData) {
        const btn = sectionFavorites.querySelector(`#heart${i++}`)
        btn.addEventListener('click', () => handleFavorites(btn, obj))
    }
}

const fillModal = section => {
    const showCards = section.querySelectorAll('.show-card')

    for (const item of showCards) {
        item.addEventListener('click', e => {
            let person = [...defaultData].filter(person => person.name === e.path[1].innerText.toString().split('\t')[0])
            person = Object.assign({}, person[0])
            modal.innerHTML =
                `<div class="card">
                <div class="card__top">
                    <img src=${person.image} alt="Portrait of ${person.name}" />
                    <div class="card__top__data">
                        <p class="card__data-title">Name:</p>
                        <p style="font-weight: bold; color: var(--first-color);">${person.name}</p>
                        <p class="card__data-title">Date of birth:</p>
                        <span>${person.dateOfBirth === '' ? 'no data' : person.dateOfBirth}</span>
                        <p class="card__data-title">Wizard:</p>
                        <span>yes</span>
                    </div>
                    ${isInFavorites(person) ? '<i class="fa-solid fa-heart red-heart"></i>' : '<i class="fa-solid fa-heart"></i>'}             
                </div>
                <div class="card__bottom" style="text-align: center;">
                    <p>
                        <span class="card__data-title">Ancestry:</span>
                        <span>${person.ancestry === '' ? 'no data' : person.ancestry}</span>
                    </p>
                    <p>
                        <span class="card__data-title">Is student/staff:</span>
                        <span>
                            ${person.hogwartsStudent ? 'student' : ''}
                            ${person.hogwartsStaff ? 'staff' : ''}
                        </span>
                    </p>
                    <p>
                        <span class="card__data-title">House:</span>
                        <span>
                        ${person.house === '' ? 'no data' : person.house}
                        </span>
                    </p>
                </div>
            </div>`
            const favoriteBtn = modal.querySelector('.fa-heart')
            favoriteBtn.addEventListener('click', () => {
                handleFavorites(favoriteBtn, person)
            })

            main.style.filter = 'blur(20px)'
            modal.style.zIndex = '7'
            modal.style.opacity = '1'
            bgCover.style.zIndex = '6'
        })
    }
}

function handleFavorites(favoriteBtn, person) {
    if (favoriteBtn.classList.contains('red-heart'))
        favoritesData = favoritesData.filter(item => item.name != person.name)
    else
        favoritesData.push(person)
    updateLocalStorage()

    if (window.innerWidth < 576)
        handleFavoriteMobile()

    favoriteBtn.classList.toggle('red-heart')
}

function isInFavorites(person) {
    for (const fav of favoritesData) {
        if (fav.name === person.name)
            return true
    }
}

hideModal = () => {
    const main = document.querySelector('main')

    main.style.filter = 'blur(0)'
    modal.style.zIndex = '-1'
    modal.style.opacity = '0'
    bgCover.style.zIndex = '-1'
}

async function getData(url, section) {
    const response = await fetch(url)
    const data = await response.json()

    defaultData = [...data]
    gryffindorData = [...data].filter(item => item.house === 'Gryffindor')
    slytherinData = [...data].filter(item => item.house === 'Slytherin')
    hufflepuffData = [...data].filter(item => item.house === 'Hufflepuff')
    ravenclawData = [...data].filter(item => item.house === 'Ravenclaw')

    sectionAndData = [
        {
            section: sectionAll,
            data: [...defaultData],
        },
        {
            section: sectionGryffindor,
            data: [...gryffindorData],
        },
        {
            section: sectionSlytherin,
            data: [...slytherinData],
        },
        {
            section: sectionHufflepuff,
            data: [...hufflepuffData],
        },
        {
            section: sectionRavenclaw,
            data: [...ravenclawData],
        }
    ]

    createList(section, data)

    let i = 0
    for (const item of defaultData) {
        const btn = document.querySelector(`#heart${i++}`)
        btn.addEventListener('click', () => handleFavorites(btn, item))
    }


    fillTable(data, section)
    fillTable(gryffindorData, sectionGryffindor)
    fillTable(slytherinData, sectionSlytherin)
    fillTable(hufflepuffData, sectionHufflepuff)
    fillTable(ravenclawData, sectionRavenclaw)



    for (const obj of sectionAndData) {
        if (obj.section.getAttribute('id') === 'favorites')
            break;
        handleSortSection(obj.data, obj.section)
    }

}

const handleSortSection = (data, section) => {
    const sortSelect = section.querySelector('.sort-select')
    const sortDesc = section.querySelector('.fa-arrow-up-short-wide')
    const sortAsc = section.querySelector('.fa-arrow-up-wide-short')

    sortAsc.addEventListener('click', () => {
        sortAsc.classList.toggle('active')
        sortDesc.classList.remove('active')
        sortedData = [...data]
        switch (sortSelect.value) {
            case 'name':
                sortedData = sortedData.sort((a, b) => {
                    return sortString(a.name, b.name)
                })
                break;
            case 'date':
                sortedData = sortedData.sort((a, b) => {
                    return sortDate(a.dateOfBirth, b.dateOfBirth)
                })
                break;
            case 'wizard':
                sortedData = sortedData.sort((a, b) => {
                    return sortBool(a.wizard, b.wizard)
                })
                break;
        }
        if (window.innerWidth < 576)
            createList(section, sortedData)
        else {
            fillTable(sortedData, section)
        }
    })
    sortDesc.addEventListener('click', () => {
        sortDesc.classList.toggle('active')
        sortAsc.classList.remove('active')
        sortedData = [...data]
        switch (sortSelect.value) {
            case 'name':
                sortedData = sortedData.sort((b, a) => {
                    return sortString(a.name, b.name)
                })
                break;
            case 'date':
                sortedData = sortedData.sort((b, a) => {
                    return sortDate(a.dateOfBirth, b.dateOfBirth)
                })
                break;
            case 'wizard':
                sortedData = sortedData.sort((b, a) => {
                    return sortBool(a.wizard, b.wizard)
                })
                break;
        }
        if (window.innerWidth < 576)
            createList(section, sortedData)
        else
            fillTable(sortedData, section)
    })

    sortSelect.addEventListener('change', () => {
        sortAsc.classList.remove('active')
        sortDesc.classList.remove('active')
    })
}

const resetSortSection = section => {
    const sortSelect = section.querySelector('.sort-select')
    const sortDesc = section.querySelector('.fa-arrow-up-short-wide')
    const sortAsc = section.querySelector('.fa-arrow-up-wide-short')

    const obj = Object.assign({}, [...sectionAndData].filter(item => item.section === section)[0])
    fillTable(obj.data, section)
    sortSelect.value = 'name'
    sortAsc.classList.remove('active')
    sortDesc.classList.remove('active')
}

const sortString = (valueA, valueB) => {
    if (valueA === valueB) {
        if (valueA > valueB)
            return -1
        else
            return 1
    }
    else if (valueA > valueB)
        return -1
    else
        return 1
}

const sortDate = (valueA, valueB) => {
    if (valueA === '')
        return 1
    valueA = valueA.split('-').reverse().join('-')
    valueB = valueB.split('-').reverse().join('-')
    if (valueA === valueB) {
        if (valueA > valueB)
            return 1
        else
            return -1
    }
    else if (valueA > valueB)
        return 1
    else
        return -1
}

const sortBool = (valueA, valueB) => {
    if (valueA)
        return 1
    else
        return -1
}

const updateLocalStorage = () => {
    localStorage.clear()
    let elementId = localStorage.length
    for (const element of favoritesData)
        localStorage.setItem(`favorites${elementId++}`, `${element.name},${element.image}`)
}

const fillFavoritesFromLocalStorage = () => {
    favoritesData = []
    for (const item of Object.values(localStorage)) {
        const arr = item.split(',')
        favoritesData.push(
            {
                name: arr[0],
                image: arr[1]
            }
        )
    }
}

fillFavoritesFromLocalStorage()
handleNavigation(navDesktop)
handleNavigation(navMobile)
createTables()
createFavorites()
getData(allApiURL, sectionAll)

burgerBtn.addEventListener('click', () => navControls.style.transform = 'translateX(0)')
closeNavMobileBtn.addEventListener('click', () => navControls.style.transform = 'translateX(-100%)')
bgCover.addEventListener('click', hideModal)


