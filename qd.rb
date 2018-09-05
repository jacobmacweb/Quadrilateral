# The more you know.
# https://gist.github.com/olegispe/ab80a55735b1652b3618dad85e04551e

require 'io/console'

class Interpreter
  def initialize code
    @stack = []
    @direction = :E
    @running = true
    @x = -1
    @y = 0
    @goto = [0,0]

    @map = []
    rows = code.delete(' ').split("\n")
    # For each row, get columns
    rows.each { |row|
      if not row.match(/^#/)
        @map.push row.split ""
      end
    }
  end

  def execute
    p @map
    begin
      # sleep 0.1
      move
      @token = @map[@y][@x]
      # puts "#{@token} - #{@x}, #{@y}, [#{@stack.join(', ')}]"
      run
    end while @running

    puts "\n\nFinished with:"
    puts "[" + @stack.join(", ") + "]"
  end
  
  def move
    case @direction
    when :N
      @y -= 1
    when :NE
      @x += 1
      @y -= 1
    when :E
      @x += 1
    when :SE 
      @x += 1
      @y += 1
    when :S 
      @y += 1
    when :SW 
      @x -= 1
      @y += 1
    when :W 
      @x -= 1
    when :NW 
      @x -= 1
      @y -= 1
    end

    if @x < 0 or @y < 0 or @x > @map[0].length or @y > @map.length
      puts "Flat-earth error #{@x},#{@y}"
      @running = false
    end
  end

  def run
    # These will be returned
    case @token
    when "?"
      char = STDIN.getch
      if char == "\u0003"
        @running = false
      end
      @stack.push char.ord
    when "!"
      char = @stack.pop
      print char.chr
    when "#"
      a = @stack.pop
      b = @stack.pop
  
      @stack.push b
      @stack.push a
    when "&"
      item = @stack.pop
      2.times {
        @stack.push item
      }
    when "="
      a = @stack.pop
      b = @stack.pop
  
      if a == b
        @stack.push 1
      else
        @stack.push 0
      end
    when "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
      @stack.push @token.to_i
    when "+"
      a = @stack.pop
      b = @stack.pop
      
      if a + b >= 256
        @stack.push 0
      else
        @stack.push a + b
      end
    when "-"
      a = @stack.pop
      b = @stack.pop
  
      @stack.push b - a
    when "*"
      a = @stack.pop
      b = @stack.pop
  
      @stack.push b * a
    when ":"
      a = @stack.pop
      b = @stack.pop
  
      @stack.push b / a
    when "$"
      @stack.pop
    when "\""
      @stack.reverse!
    when "'"
      @stack.push @stack.pop
    when "~"
      if @stack.pop == 0
        move
      end
    when ","
      @goto = [@x, @y]
    when ";"
      place = @goto
      @x = place[0]
      @y = place[1]
    when "@"
      @running = false
    # Directions
    when "^"
      @direction = :N
    when ">"
      @direction = :E 
    when "v"
      @direction = :S
    when "<"
      @direction = :W
    when "/"
      case @direction
      when :N, :W
        @direction = :SE
      when :S, :E
        @direction = :NW
      end
    when "\\"
      case @direction
      when :N, :E
        @direction = :SW
      when :S, :W 
        @direction = :NE 
      end
    when "_"
      case @direction
      when :N
        @direction = :S
      when :NE 
        @direction = :SE
      when :NW
        @direction = :SW
      when :S 
        @direction = :N
      when :SE 
        @direction = :NE
      when :SW
        @direction = :NW
      end
    when "|"
      case @direction
      when :E
        @direction = :W
      when :NE 
        @direction = :NW
      when :NW
        @direction = :NE
      when :W
        @direction = :E
      when :SE 
        @direction = :SW
      when :SW
        @direction = :SE
      end
    end
  end
end

(Interpreter.new File.read(ARGV[0])).execute