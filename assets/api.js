const apiUrl = 'http://127.0.0.1:3001/api/ideas'; 

// Fungsi untuk mengambil data dari API menggunakan fetch
async function fetchData(pageNumber = 1, pageSize = 10, sortBy = '-published_at') {
    try {
        const params = new URLSearchParams({
            'page[number]': pageNumber,
            'page[size]': pageSize,
            'append': 'small_image,medium_image',
            'sort': sortBy,
        });

        const response = await fetch(apiUrl + '?' + params.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched data:', data); 

            // Check if data and data.data exist
            if (data && Array.isArray(data.data)) {
                renderPosts(data.data);  
                updatePagination(data.meta.pagination);
            } else {
                console.error('Data not in expected format:', data);
            }
        } else {
            console.error('Failed to load data:', response.statusText);
            const errorDetails = await response.text(); 
            console.error('Error details:', errorDetails);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
}

function renderPosts(posts) {
    if (!Array.isArray(posts)) {
        console.error('Data post tidak valid:', posts);
        return;
    }

    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';  

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        
        const imageUrl = post.small_image || post.medium_image || 'page/assets/img/default-img.png'; 
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl; 
        imageElement.alt = post.title || 'Post image';
        imageElement.loading = 'lazy';

        const contentElement = document.createElement('div');
        contentElement.classList.add('content');

        const titleElement = document.createElement('h3');
        titleElement.textContent = post.title || 'Untitled';  

        const dateElement = document.createElement('p');
        dateElement.textContent = post.published_at ? new Date(post.published_at).toLocaleDateString() : 'No date available';  

        contentElement.appendChild(titleElement);
        contentElement.appendChild(dateElement);

        postElement.appendChild(imageElement);
        postElement.appendChild(contentElement);

        postsContainer.appendChild(postElement);
    });
}

// Fungsi untuk mengupdate pagination
function updatePagination(paginationMeta) {
    if (!paginationMeta || !paginationMeta.total_pages) {
        console.error('Pagination data is missing or invalid');
        return;
    }

    const paginationContainer = document.querySelector('.pagination');
    const totalPages = paginationMeta.total_pages;

    // Kosongkan pagination yang lama
    paginationContainer.innerHTML = '';

    // Previous button
    const prevPage = document.createElement('a');
    prevPage.href = '#';
    prevPage.innerHTML = '&laquo;';
    prevPage.classList.add('prev');
    prevPage.classList.toggle('disabled', currentPage === 1);
    paginationContainer.appendChild(prevPage);

    // Halaman 1, 2, 3, dst
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.classList.add(i === currentPage ? 'active' : '');  
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            const pageSize = document.getElementById('itemsPerPage').value;
            const sortBy = document.getElementById('sortBy').value;
            fetchData(i, pageSize, sortBy);  
        });
        paginationContainer.appendChild(pageLink);
    }

    // Next button
    const nextPage = document.createElement('a');
    nextPage.href = '#';
    nextPage.innerHTML = '&raquo;';
    nextPage.classList.add('next');
    nextPage.classList.toggle('disabled', currentPage === totalPages);  
    paginationContainer.appendChild(nextPage);
}

// Mengambil data setelah DOM siap
document.addEventListener('DOMContentLoaded', function () {
    // Mengambil data pertama kali saat halaman dimuat
    fetchData(1, 10, '-published_at');  
});

// Event listener untuk dropdown itemsPerPage dan sortBy
document.getElementById('itemsPerPage').addEventListener('change', () => {
    const pageSize = document.getElementById('itemsPerPage').value;
    const sortBy = document.getElementById('sortBy').value;
    fetchData(1, pageSize, sortBy); 
});

document.getElementById('sortBy').addEventListener('change', () => {
    const pageSize = document.getElementById('itemsPerPage').value;
    const sortBy = document.getElementById('sortBy').value;
    fetchData(1, pageSize, sortBy); 
});
