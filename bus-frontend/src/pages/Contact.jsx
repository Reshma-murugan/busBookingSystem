export default function Contact() {
  return (
    <div className="container">
      <div className="card">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        
        <div className="grid grid-2">
          <div>
            <h3 className="font-semibold mb-2">Get in Touch</h3>
            <p className="mb-4">
              We're here to help you with your bus booking needs. 
              Reach out to us through any of the following channels:
            </p>
            
            <div className="text-sm">
              <p className="mb-2"><strong>Phone:</strong> +91 1234567890</p>
              <p className="mb-2"><strong>Email:</strong> support@busbooking.com</p>
              <p className="mb-2"><strong>Address:</strong> 123 Bus Terminal Road, Chennai, Tamil Nadu 600001</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Business Hours</h3>
            <div className="text-sm">
              <p className="mb-1">Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p className="mb-1">Saturday: 9:00 AM - 6:00 PM</p>
              <p className="mb-1">Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}