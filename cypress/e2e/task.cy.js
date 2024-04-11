describe('Place an order Functinality', () => {
  before(() => {
    // Open the URL
    cy.visit('https://php811.funnelkitdemos.com/')
  });

  
  it('should show order id once the checkout process complete successfully', () => {
 
      // Click on Add to cart button of a product
      cy.get('.button.product_type_simple.add_to_cart_button.ajax_add_to_cart').first().click()
  
      // Wait for side cart to auto-open after product is added
      cy.get('#fkcart-checkout-button').should('be.visible')
  
      // Click on the 'Add to Cart' button at the bottom if any products suggested to add in to card
      cy.get('.fkcart-add-product-button.fkcart-button').then(suggestedproducts => {
        if (suggestedproducts.length > 0) {
      cy.get('.fkcart-add-product-button.fkcart-button').first().click()
      }
    })

    //  click on checkout button
      cy.get('#fkcart-checkout-button').click()
  
      // Validate redirection to checkout page
      cy.url().should('include', '/checkout')
  
      // read and Fill in data from fixure fileand choose 'Cash on delivery' payment method
      cy.fixture('user-details').then((data)=> {
    
      cy.get('#billing_email').type(data.emailId)
      cy.get('#billing_first_name').type(data.firstName)
      cy.get('#billing_last_name').type(data.lastName)
      cy.get('#shipping_address_1').type(data.address)
      cy.get('#shipping_city').type(data.city)
      cy.get('#shipping_postcode').type(data.postcode)
   
    // Handle alert if present
      cy.get('#pushengage-opt-in-1-close').click()

      cy.get('#shipping_country').select(data.country, {force:true})
      cy.get('#shipping_country').should('have.value', data.country)
      cy.get('#shipping_state').select(data.state, {force:true})
      cy.get('#shipping_state').should('have.value', data.state)
      cy.get('#billing_phone').type(data.phone)
  
    })
      cy.wait(2000)

      // Handle offer if present
      cy.get('.wfob_checkbox.wfob_bump_product.wfob_bump_product').then(offerCheckBox => {
        if (offerCheckBox.length > 0) {
          cy.get('.wfob_checkbox.wfob_bump_product.wfob_bump_product').check()
        }
      })

      cy.wait(1000)
       
      // click on place order button
      cy.get('.wfacp-order-place-btn-wrap #place_order').click()

      // Handle window alert (save address alert)
      cy.on('window:alert', (message) => {
        if (message.includes('Save')) {

          cy.log('Save button clicked');
        } else {
          cy.log('No Thanks button clicked');
        }
      });
 
    // click on yes, add this to my order button for last product to be added
      cy.get('.elementor-button.elementor-button-link.wfocu_upsell').click()
  
      cy.wait(5000)

      // Validate order id
      cy.xpath('//div[@class="elementor-widget-container" and contains(text(), "Order #")]').should('be.visible').invoke('text')
      .then((text) => {
        expect(text).to.include('Order #')
       const orderIdText = text.split('#')
       let id = parseInt(orderIdText[orderIdText.length-1])
        cy.log(`Order id is ${id} and the datatype is ${typeof(id)}`)
        expect(typeof(id)).to.equal('number') 
        expect(id).to.be.within(1, 100000)    
      })
       // Validate redirection to thank you page
       cy.url().should('include', '/order-confirmed')
    })
  })