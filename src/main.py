from utils import square, is_even, celsius_to_fahrenheit

user_input = float(input("Enter a number: "))

num_squared = square(user_input)
num_is_even = is_even(user_input)
fahrenheit = celsius_to_fahrenheit(user_input)

print(f"The square is {num_squared}.")
print(f"Is the number even? {num_is_even}.")
print(f"The temperature in Fahrenheit is {fahrenheit}.")
