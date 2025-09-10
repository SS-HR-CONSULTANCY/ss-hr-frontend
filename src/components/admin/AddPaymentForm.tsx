import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AppDispatch } from "@/store/store";
import { toggleAddPaymentForm } from "@/store/slices/paymentSlice";
import { createPayment } from "@/utils/apis/paymentApi";
import type { CreatePaymentFormData } from "@/types/entities/payment";

const AddPaymentForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Omit<CreatePaymentFormData, 'customerId' | 'packageId'>>({
    customerName: "",
    packageName: "",
    totalAmount: 0,
    paidAmount: 0,
    paymentMethod: "googlepay",
    paymentDate: "",
    referenceId: "",
    paymentProof: "",
    adminNotes: "",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success("Payment created successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      dispatch(toggleAddPaymentForm());
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create payment");
    },
  });

  const resetForm = () => {
    setFormData({
      customerName: "",
      packageName: "",
      totalAmount: 0,
      paidAmount: 0,
      paymentMethod: "googlepay",
      paymentDate: "",
      referenceId: "",
      paymentProof: "",
      adminNotes: "",
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    } else if (formData.customerName.length < 2) {
      newErrors.customerName = "Customer name must be at least 2 characters";
    }

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Package name is required";
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be greater than 0";
    }

    if (formData.paidAmount < 0) {
      newErrors.paidAmount = "Paid amount cannot be negative";
    }

    if (formData.paidAmount > formData.totalAmount) {
      newErrors.paidAmount = "Paid amount cannot exceed total amount";
    }

    if (!formData.paymentDate.trim()) {
      newErrors.paymentDate = "Payment date is required";
    }

    if (!formData.referenceId.trim()) {
      newErrors.referenceId = "Reference ID is required";
    } else if (formData.referenceId.length < 3) {
      newErrors.referenceId = "Reference ID must be at least 3 characters";
    }

    if (!formData.paymentProof.trim()) {
      newErrors.paymentProof = "Payment proof URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Add dummy ObjectIds when submitting to backend
      const paymentData: CreatePaymentFormData = {
        ...formData,
        customerId: "507f1f77bcf86cd799439011",
        packageId: "507f1f77bcf86cd799439012",
      };
      createMutation.mutate(paymentData);
    }
  };

  const handleCancel = () => {
    dispatch(toggleAddPaymentForm());
    resetForm();
  };

  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (field: 'totalAmount' | 'paidAmount', value: string) => {
    const numericValue = parseInt(value.replace(/,/g, '')) || 0;
    setFormData({ ...formData, [field]: numericValue });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-black mb-6">Add New Payment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Package Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName" className="text-black">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="bg-white text-black border-gray-300"
              placeholder="Enter customer name"
            />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
          </div>

          <div>
            <Label htmlFor="packageName" className="text-black">Package Name</Label>
            <Input
              id="packageName"
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              className="bg-white text-black border-gray-300"
              placeholder="Enter package name"
            />
            {errors.packageName && <p className="text-red-500 text-sm mt-1">{errors.packageName}</p>}
          </div>
        </div>

        {/* Payment Amounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalAmount" className="text-black">Total Amount (₹)</Label>
            <Input
              id="totalAmount"
              value={formatCurrency(formData.totalAmount.toString())}
              onChange={(e) => handleAmountChange('totalAmount', e.target.value)}
              className="bg-white text-black border-gray-300"
              placeholder="50,000"
            />
            {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
          </div>

          <div>
            <Label htmlFor="paidAmount" className="text-black">Paid Amount (₹)</Label>
            <Input
              id="paidAmount"
              value={formatCurrency(formData.paidAmount.toString())}
              onChange={(e) => handleAmountChange('paidAmount', e.target.value)}
              className="bg-white text-black border-gray-300"
              placeholder="20,000"
            />
            {errors.paidAmount && <p className="text-red-500 text-sm mt-1">{errors.paidAmount}</p>}
          </div>
        </div>

        {/* Balance Display */}
        {formData.totalAmount > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg border">
            <span className="text-sm text-gray-600">Balance Amount: </span>
            <span className={`font-medium ${(formData.totalAmount - formData.paidAmount) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{formatCurrency((formData.totalAmount - formData.paidAmount).toString())}
            </span>
          </div>
        )}

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="paymentMethod" className="text-black">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value: 'googlepay' | 'banktransfer' | 'cash') => 
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <SelectTrigger className="bg-white text-black border-gray-300">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="googlepay">Google Pay</SelectItem>
                <SelectItem value="banktransfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentDate" className="text-black">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              className="bg-white text-black border-gray-300"
            />
            {errors.paymentDate && <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="referenceId" className="text-black">Reference ID</Label>
            <Input
              id="referenceId"
              value={formData.referenceId}
              onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
              className="bg-white text-black border-gray-300"
              placeholder="GP123456789"
            />
            {errors.referenceId && <p className="text-red-500 text-sm mt-1">{errors.referenceId}</p>}
          </div>

          <div>
            <Label htmlFor="paymentProof" className="text-black">Payment Proof URL</Label>
            <Input
              id="paymentProof"
              value={formData.paymentProof}
              onChange={(e) => setFormData({ ...formData, paymentProof: e.target.value })}
              className="bg-white text-black border-gray-300"
              placeholder="https://drive.google.com/file/d/..."
            />
            {errors.paymentProof && <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <Label htmlFor="adminNotes" className="text-black">Admin Notes</Label>
          <Textarea
            id="adminNotes"
            value={formData.adminNotes}
            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
            className="bg-white text-black border-gray-300 min-h-20"
            placeholder="Enter any additional notes..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 text-black hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createMutation.isPending ? "Creating..." : "Create Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentForm;