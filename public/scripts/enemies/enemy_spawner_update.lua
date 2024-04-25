
local time = get_time()
function update(entity)
  transform = get_transform(entity)
  if (transform) then
    if get_time() - time > 500 then
      child = spawn_prefab("enemy")
      childTransform = get_transform(child)
      if childTransform then
        childTransform.translation = { transform.translation[1], transform.translation[2], transform.translation[3] }
      end
      time = get_time()
    end
  end

  x = math.cos(get_time() / 1000) * 12
  transform.translation = { x, transform.translation[2],  transform.translation[3] }
end

return update