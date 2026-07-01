import Layout from "@/src/layouts/Layout";
import Link from "next/link";

const OrderSuccess = () => {
  return (
    <Layout>
      <section className="hero-section gap text-center" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-lg border-0 rounded-4 p-5">
                <div className="mb-4">
                  <i className="fa-solid fa-circle-check text-success" style={{ fontSize: "80px" }}></i>
                </div>
                <h1 className="fw-bold mb-3">Order Successful!</h1>
                <p className="text-muted mb-4">
                  Thank you for your order. Your food is being prepared and will be delivered to you soon!
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link href="/restaurants" className="btn btn-warning px-4 py-2 fw-bold text-dark">
                    Order More Food
                  </Link>
                  <Link href="/profile" className="btn btn-outline-dark px-4 py-2 fw-bold">
                    View Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderSuccess;
