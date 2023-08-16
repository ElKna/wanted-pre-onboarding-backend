resource "aws_internet_gateway" "ig-tf" {
  vpc_id = aws_vpc.vpc-tf.id
  tags = {"Name" = "Terraform resource"}
}