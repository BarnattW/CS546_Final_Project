document.addEventListener("DOMContentLoaded", () => {
    const cancelButton = document.getElementById("cancel-order");

    if (cancelButton) {
        cancelButton.addEventListener("click", async () => {
            const orderId = cancelButton.getAttribute("data-order-id");

            if (confirm("Are you sure you want to cancel this order?")) {
                try {
                    const response = await fetch(`/orders/${orderId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        alert("Order successfully cancelled.");
                        window.location.href = "/orders";
                    } else {
                        const error = await response.json();
                        alert(`Error cancelling order: ${error.error}`);
                    }
                } catch (e) {
                    console.error("Error cancelling order:", e);
                    alert("Failed to cancel the order. Please try again later.");
                }
            }
        });
    }
});
