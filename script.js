const apiUrl = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";

async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        const data = await response.json();
        // console.log(data);
        populateProductDetails(data.product);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function populateProductDetails(product) {
    // product details
    document.querySelector('.productVendor').textContent = `${product.vendor}`;
    document.querySelector('.productTitle').textContent = product.title;
    document.querySelector('.productPrice').textContent = `${product.price}`;
    document.querySelector('.compareAtPrice').textContent = `${product.compare_at_price}`;
    // Calculate the percentage off
const compareAtPrice = parseInt(product.compare_at_price.slice(1)); // Remove the $ sign and convert to integer
const price = parseInt(product.price.slice(1)); // Remove the $ sign and convert to integer
const percentageOff = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);

// Display the percentage off
document.querySelector('.percentageOff').textContent = `${percentageOff}% off`;

    document.querySelector('.productDescription').innerHTML = product.description;

    // Update product image
    const productImage = document.querySelector('.product-image img');
    const productImageUrl = product.images[0].src;
  
    // Function to check if the image URL is valid
async function isImageOk(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Check if the product image URL is valid
isImageOk(productImageUrl)
    .then((isValid) => {
        if (isValid) {
            // If the image URL is valid set the product image URL
            productImage.src = productImageUrl;
        } else {
            // If the image URL is not valid set the default image in HTML
            productImage.src = './images/Rectangle 4.png';
        }
    })
    .catch((error) => {
        console.error('Error checking image status:', error);
    });
    

    const thumbnailsContainer = document.querySelector('.thumbnails');

    // Loop through each image in the product's images array
    product.images.forEach((image) => {
        // Check if the image URL is valid
        isImageOk(image.src)
            .then((isImageOk) => {
                // Create a thumbnail element
                const thumbnail = document.createElement('img');
                thumbnail.classList.add('thumbnail');
    
                // If the image URL is valid set it for the thumbnail
                if (isImageOk) {
                    thumbnail.src = image.src;
                } else {
                    // If the image URL is not valid use the default image
                    thumbnail.src = './images/icons8-bag-96.png';
                }
    
                // Add a click event listener to change the main product image when clicked
                thumbnail.addEventListener('click', () => {
                    // Save the current source of the thumbnail
                    const tempSrc = thumbnail.src;

                 // Swap  thumbnail with product image
                    thumbnail.src = productImage.src;
        
                    // Update the main product image with thumbnail image
                        productImage.src = tempSrc;
                });
    
                // Append the thumbnail to the thumbnails container
                thumbnailsContainer.appendChild(thumbnail);
            })
            .catch((error) => {
                console.error('Error checking image status:', error);
            });
    });
    



    const colorSelector = document.querySelector('.colorSelector');
    product.options.find(option => option.name === 'Color').values.forEach(value => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = Object.values(value)[0];
        colorOption.addEventListener('click', () => {
            clearSelection()
            clearCartContainer(); // Clear cart container when color is clicked
            colorOption.classList.add('selected'); // Add selected class to clicked color option
        });
        colorSelector.appendChild(colorOption);
    });


    function clearSelection() {
        const colorOptions = document.querySelectorAll('.colorSelector .color-option');
        colorOptions.forEach(option => {
            option.classList.remove('selected');
        });
    }

    const sizeSelector = document.querySelector('.sizeSelector');
    product.options.find(option => option.name === 'Size').values.forEach(size => {
        const label = document.createElement('label');
        label.textContent = size;
        
        const radioButton = document.createElement('input');
        
        radioButton.name = 'size';
        radioButton.type = 'radio';
        radioButton.value = size;

        label.appendChild(radioButton);
        sizeSelector.appendChild(label);
        radioButton.addEventListener('click', () => {
            clearCartContainer(); // Clear cart container when size is selected
        });
    });
    const decreaseButton = document.getElementById('decreaseQuantity');
    const increaseButton = document.getElementById('increaseQuantity');
    const quantityInput = document.getElementById('quantity');

    quantityInput.addEventListener('input', () => {
        clearCartContainer(); // Clear cart container when quantity is changed
    });
    decreaseButton.addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            clearCartContainer(); // Clear cart container when quantity is changed
        }
    });

    increaseButton.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        clearCartContainer(); // Clear cart container when quantity is changed
    });
    const addToCartButton = document.getElementById('addToCartButton');
    addToCartButton.addEventListener('click', () => {
        const selectedColor = document.querySelector('.colorSelector .color-option.selected')?.style.backgroundColor;
        // console.log(selectedColor);
        const selectedSize = document.querySelector('.sizeSelector input:checked')?.value;

        if (!selectedColor || !selectedSize) {
            const selectionMessage = document.querySelector('.selectionMessage');
            selectionMessage.textContent = "Please select both color and size before adding to cart.";
            selectionMessage.style.display = 'block'; // Show the message
            return; // exiting the function
        }
    
        // If both color and size are selected
        clearSelectionMessage(); // Clear any previous selection message

        function rgbToColorName(rgb) {
            // Color mapping from RGB to color names
            const colorMap = {
                'rgb(236, 222, 204)': 'Yellow',
                'rgb(187, 210, 120)': 'Green',
                'rgb(187, 193, 248)': 'Blue',
                'rgb(255, 211, 248)': 'Pink',
            };
        
            return colorMap[rgb] || rgb; // Return color name 
        }

        // console.log(rgbToColorName(selectedColor));

        const cartItem = document.createElement('div');
        cartItem.classList.add('cartItem');
        cartItem.textContent = `${product.title} with Color ${rgbToColorName(selectedColor)} and Size ${selectedSize} added to cart`;

        
        // Append the cart item to the container
        const cartContainer = document.querySelector('.cartContainer');
        cartContainer.appendChild(cartItem);
    });

    colorSelector.addEventListener('change', saveSelectedVariant);
    sizeSelector.addEventListener('change', saveSelectedVariant);
    quantityInput.addEventListener('input', saveSelectedVariant);

function saveSelectedVariant() {
    const selectedColor = document.querySelector('.colorSelector .color-option.selected')?.style.backgroundColor;
    const selectedSize = document.querySelector('.sizeSelector input:checked')?.value;
    const selectedQuantity = quantityInput.value;

    // Save the selected variant data to localStorage 
    localStorage.setItem('selectedVariant', JSON.stringify({ color: selectedColor, size: selectedSize, quantity: selectedQuantity }));
}

    function clearSelectionMessage() {
        const selectionMessage = document.querySelector('.selectionMessage');
        selectionMessage.textContent = ''; // Clear the selection message
        selectionMessage.style.display = 'none'; // Hide the message

    }
    
    function clearCartContainer() {
        const cartContainer = document.querySelector('.cartContainer');
        cartContainer.innerHTML = ''; // Remove all child elements
    }
}


fetchData();
